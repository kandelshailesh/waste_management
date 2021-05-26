import { sequelize } from '../models';

const { subscriptions, users, packages, transaction } = require('../models');
const { too, ReS, ReE, TE, paginate } = require('./util');
const omit = require('lodash/omit');
const moment = require('moment');

export const createSubscription = async param => {
  try {
    const user_id = param['user_id'];
    const package_id = param['package_id'];
    const [err, data] = await too(
      packages.findOne({ where: { id: package_id } }),
    );
    if (err) return TE(err.message);
    if (!data) TE('Package not found');
    param['renewal_date'] = new Date(
      moment(param['activation_date']).add(data['duration'], data['unit']),
    );
    console.log(param);

    const [err3, data3] = await too(
      subscriptions.findOne({ where: { user_id }, paranoid: false }),
    );

    if (err3) return TE(err2.message);
    if (data3) {
      param['deletedAt'] = null;
      const [err4, data4] = await too(
        subscriptions.update(param, {
          where: { id: data3['id'] },
          paranoid: false,
        }),
      );
      if (err4) TE(err4.message);
      const [err1, data1] = await too(
        users.findOne({ where: { id: user_id } }),
      );
      const [err5, data5] = await too(
        subscriptions.findOne({ where: { id: data3['id'] } }),
      );
      data1.subscribed = true;
      await data1.save();
      if (data4) return data5;
    } else {
      const [err2, data2] = await too(subscriptions.create(param));
      if (err2) return TE(err2.message);
      const [err1, data1] = await too(
        users.findOne({ where: { id: user_id } }),
      );
      data1.subscribed = true;

      const [err6, data6] = await too(transaction.create(param.transaction));
      if (err6) return TE(err6.message);
      await data1.save();
      if (data2) return data2;
    }
  } catch (error) {
    return TE(error.message);
  }
};

export const getSubscription = async param => {
  let page, limit;
  page = parseInt(param['page']);
  limit = parseInt(param['limit']);
  if (!page) page = 1;
  if (!limit) limit = 20;
  const query = omit(param, ['page', 'limit']);
  try {
    let err, allModules;
    if (!param.date) {
      [err, allModules] = await too(
        subscriptions.findAndCountAll({
          where: Object.keys(query).length > 0 ? query : '',
          ...paginate(page, limit),
          include: [{ model: users }, { model: packages }],
        }),
      );
    } else {
      [err, allModules] = await too(
        subscriptions.findAndCountAll({
          attributes: [
            'id',
            'activation_date',
            [sequelize.fn('DATE', sequelize.col('activation_date')), 'date'],
            [sequelize.fn('count', sequelize.col('subscriptions.id')), 'total'],
          ],
          include: [{ model: packages }],
          group: [
            sequelize.fn('DATE', sequelize.col('activation_date')),
            'activation_date',
          ],
        }),
      );
    }
    console.log(err);
    if (err) TE(err.message);
    if (!allModules) TE('SOMETHING WENT WRONG WHILE FETCHING');
    return allModules;
  } catch (error) {
    TE(error.message);
  }
};

export const getSubscriptionByPackage = async param => {
  try {
    const [err, allModules] = await too(
      packages.findAll({
        include: [{ model: subscriptions }],
      }),
    );
    if (err) TE(err.message);
    if (!allModules) TE('SOMETHING WENT WRONG WHILE FETCHING');
    return allModules;
  } catch (error) {
    TE(error.message);
  }
};

export const updateSubscription = async (param, id) => {
  try {
    const package_id = param['package_id'];
    const [err, data] = await too(
      packages.findOne({ where: { id: package_id } }),
    );
    const [err1, data1] = await too(
      subscriptions.findOne({ where: { user_id: id } }),
    );
    if (err) return TE(err.message);
    if (!data) TE('Package not found');
    param['renewal_date'] = new Date(
      moment(data1['renewal_date']).add(data['duration'], data['unit']),
    );
    console.log(param);

    const [err2, data2] = await too(
      subscriptions.update(param, { where: { user_id: id } }),
    );
    if (err2) return TE(err2.message);
    const [err6, data6] = await too(transaction.create(param.transaction));
    if (err6) return TE(err6.message);
    if (data2) return data2;
  } catch (error) {
    return TE(error.message);
  }
};

export const deleteSubscription = async id => {
  try {
    const [err1, data1] = await too(
      subscriptions.findOne({ where: { id: id } }),
    );
    if (err1) TE(err1.message);
    const [err2, data2] = await too(
      subscriptions.destroy({ where: { id: id } }),
    );
    if (err2) TE(err2.message);
    const [err3, data3] = await too(
      users.findOne({ where: { id: data1['user_id'] } }),
    );
    data3.subscribed = false;
    await data3.save();
    if (!data2) TE('SOMETHING WENT WRONG WHILE DELETING');
    return data2;
  } catch (error) {
    TE(error.message);
  }
};
