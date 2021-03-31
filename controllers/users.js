const { users, subscriptions, packages } = require('../models');
const { too, ReS, ReE } = require('../utils');
const { status_codes_msg, STRINGS } = require('../utils/statusCode.js');
const { Op } = require('sequelize');

export const createUser = async (req, res) => {
  try {
    const param = req.body;
    if (req.files) {
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

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.files) {
      req.body.image = req.files['image'] ? req.files['image'][0].path : null;
    }

    console.log(req.body);
    const [err, data] = await too(
      users.update(req.body, { where: { id: id } }),
    );
    if (err) return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data)
      return ReS(
        res,
        { message: 'User update successfully', data: data },
        status_codes_msg.CREATED.code,
      );
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
    // console.log("data",data)
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
        message: 'Logged in successfully',
        data: user.toWeb(),
        token: user.getJWT(),
      },
      status_codes_msg.CREATED.code,
    );
  } catch (error) {
    return ReE(res, error, status_codes_msg.INVALID_ENTITY.code);
  }
};

export const updatePassword = async (req, res) => {};
