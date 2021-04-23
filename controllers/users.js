const { users, subscriptions, packages } = require('../models');
const { too, ReS, ReE, TE } = require('../utils');
const { status_codes_msg, STRINGS } = require('../utils/statusCode.js');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
export const createUser = async (req, res) => {
  try {
    const param = req.body;
    if (req?.files?.image) {
      param.image = req.files['image'] ? req.files['image'][0].path : null;
    }
    if (!param.status) {
      param.status = 'active';
    }

    const [err, data] = await too(users.create(param));
    // [err, data] = await to(UserService.createUser(params));
    if (err) return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data)
      return ReS(
        res,
        { message: 'Users found.', data: data },
        status_codes_msg.CREATED.code,
      );
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};

export const passwordEncrypt = async password => {
  let salt, hash, err;
  [err, salt] = await too(bcrypt.genSalt(10));
  if (err) TE(err.message, true);
  console.log(salt);
  [err, hash] = await too(bcrypt.hash(password, salt));
  if (err) TE(err.message, true);

  return hash;
};

export const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const param = req.body;

    if (req?.files?.image) {
      param.image = req.files['image'] ? req.files['image'][0].path : null;
    }

    if (param.password) {
      const pas = await passwordEncrypt(param.password);
      param.password = pas;
      param.passwordChangedAt = Date.now();
    }
    const [err, data] = await too(users.update(param, { where: { id: id } }));
    if (err) return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data) {
      const [err1, data1] = await too(users.findOne({ where: { id: id } }));
      return ReS(
        res,
        { message: 'User updated successfully', data: data1 },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [err, data] = await too(users.destroy({ where: { id: id } }));
    if (err) ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data) {
      return ReS(
        res,
        { message: 'Users deleted successfully', data: [] },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const query = req.query;
    // const { id } = req.params;
    const [err, data] = await too(
      users.findAll({
        where: Object.keys(query).length > 0 ? query : '',
        attributes: {
          exclude: ['password'],
        },
        include: [{ model: subscriptions, include: [{ model: packages }] }],
      }),
    );

    if (err) ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data) {
      return ReS(
        res,
        { message: 'Users fetched successfully', data: data },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};

export const fetchUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [err, data] = await too(users.findOne({ where: { id: id } }));
    if (err) ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data) {
      return ReS(
        res,
        { message: 'Users fetched successfully', data: data.toWeb() },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};

export const Login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, username = '' } = req.body;
    let [err, user] = await too(
      users.findOne({
        where: {
          [Op.or]: [{ email: email }, { username: username }],
        },
      }),
    );
    if (err) TE(err.message);
    if (!user) TE('User not registered');
    if (user.status === 'hold') {
      TE('Your account is hold,contact with your team');
    }
    [err, user] = await too(user.comparePassword(password));
    if (err) TE(err.message);

    return ReS(
      res,
      {
        message: 'Login successfully',
        data: user.toWeb(),
        token: user.getJWT(),
      },
      status_codes_msg.CREATED.code,
    );
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};

export const updatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const param = req.body;
    const { password, new_password } = req.body;
    let [err, user] = await too(
      users.findOne({
        where: { id: id },
      }),
    );
    if (err) TE(err.message);
    if (!user) TE('User not registered');
    [err, user] = await too(user.comparePassword(password));
    if (err) TE(err.message);
    if (param.new_password) {
      const pas = await passwordEncrypt(param.new_password);
      param.password = pas;
      param.passwordChangedAt = Date.now();
    }
    const [err2, data] = await too(users.update(param, { where: { id: id } }));
    if (err) return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data) {
      const [err1, data1] = await too(users.findOne({ where: { id: id } }));
      return ReS(
        res,
        { message: 'Password changed successfully', data: data1 },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};
