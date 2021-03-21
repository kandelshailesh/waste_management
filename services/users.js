const { users } = require('../models');
const { too, ReS, ReE } = require('./util');

export const createUser = async (req, res) => {
  try {
    const [err, data] = await too(users.create(req.body));
    if (err) return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data)
      return ReS(
        res,
        { message: 'Users found.', data: data },
        status_codes_msg.CREATED.code,
      );
  } catch (error) {
    return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
  }
};
export const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const [err, data] = await too(users.update(req.body,{where:{id:id}}));
        if (err) return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
        if (data)
          return ReS(
            res,
            { message: 'User update successfully', data: data },
            status_codes_msg.CREATED.code,
          );
      } catch (error) {
        return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
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
    return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
  }
};
const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [err, data] = await too(users.findAll();
    if (err) ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    if (data) {
      return ReS(
        res,
        { message: 'Users fetched successfully', data:data },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
  }
};

const fetchUserByID = async (req, res) => {
    try {
      const { id } = req.params;
      const [err, data] = await too(users.findOne({where:{id:id}});
      if (err) ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
      if (data) {
        return ReS(
          res,
          { message: 'Users fetched successfully', data:data },
          status_codes_msg.CREATED.code,
        );
      }
    } catch (error) {
      return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    }
  };

 export const Login = async (req, res) => {
    try {
      const { email,password } = req.body;
      let [err, user] = await too(
        users.findOne({
            where: [{ email: email }],          
        
        })
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
          { message: 'Logged in successfully', data:data.toWeb(),token:data.getJWT() },
          status_codes_msg.CREATED.code,
        );
    
    } catch (error) {
      return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
    }
  };


  export const updatePassword = async(req,res)=>{
      
  }