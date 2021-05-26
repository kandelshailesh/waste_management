import { Op } from 'sequelize';

const { schedules, users } = require('../models');
const { too, ReS, ReE, TE, paginate } = require('./util');
const omit = require('lodash/omit');
import moment from 'moment';

export const createSchedule = async param => {
  try {
    const [err, data] = await too(schedules.create(param));
    if (err) return TE(err.message);
    if (data) return data;
  } catch (error) {
    return TE(error.message);
  }
};

export const getSchedule = async param => {
  console.log(param);
  let page, limit;
  page = parseInt(param['page']);
  limit = parseInt(param['limit']);
  param['user_id'] = 1;
  // param['collection_date']=
  if (!page) page = 1;
  if (!limit) limit = 20;
  const query = omit(param, ['page', 'limit']);
  try {
    let err, allModules;
    if (param.user_id) {
      [err, allModules] = await too(
        schedules.findAndCountAll({
          where: {
            [Op.and]: {
              user_id: param['user_id'],
              status: 'uncollected',
              collection_date: {
                [Op.gte]: moment().toDate(),
              },
            },
          },
          ...paginate(page, limit),
          include: [{ model: users }],
        }),
      );
    } else {
      [err, allModules] = await too(
        schedules.findAndCountAll({
          ...paginate(page, limit),
          include: [{ model: users }],
        }),
      );
    }

    if (err) TE(err.message);
    if (!allModules) TE('SOMETHING WENT WRONG WHILE FETCHING');
    console.log(allModules);
    return allModules;
  } catch (error) {
    TE(error.message);
  }
};

export const updateSchedule = async (param, id) => {
  try {
    const [err, data] = await too(
      schedules.update(param, { where: { id: id } }),
    );
    if (err) TE(err.message);
    if (!data) TE('SOMETHING WENT WRONG WHILE UPDATING');
    const [err1, data1] = await too(schedules.findOne({ where: { id: id } }));
    if (err1) TE(err1.message);
    if (!data1) TE('SOMETHING WENT WRONG WHILE UPDATING');
    return data1;
  } catch (error) {
    TE(error.message);
  }
};

export const deleteSchedule = async id => {
  try {
    const [err, data] = await too(schedules.destroy({ where: { id: id } }));
    if (err) TE(err.message);
    if (!data) TE('SOMETHING WENT WRONG WHILE DELETING');
    return data;
  } catch (error) {
    TE(error.message);
  }
};
