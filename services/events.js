const { events } = require('../models');
const { too, ReS, ReE, TE, paginate } = require('./util');
const omit = require('lodash/omit');

export const createEvent = async param => {
  try {
    const [err, data] = await too(events.create(param));
    if (err) return TE(err.message);
    if (data) return data;
  } catch (error) {
    return TE(error.message);
  }
};

export const getEvent = async param => {
  let page, limit;
  page = parseInt(param['page']);
  limit = parseInt(param['limit']);
  if (!page) page = 1;
  if (!limit) limit = 20;
  const query = omit(param, ['page', 'limit']);
  try {
    const [err, allModules] = await too(
      events.findAndCountAll({
        where: Object.keys(query).length > 0 ? query : '',
        ...paginate(page, limit),
      }),
    );
    if (err) TE(err.message);
    if (!allModules) TE('SOMETHING WENT WRONG WHILE FETCHING');
    return allModules;
  } catch (error) {
    TE(error.message);
  }
};

export const updateEvent = async (param, id) => {
  try {
    const [err, data] = await too(events.update(param, { where: { id: id } }));
    if (err) TE(err.message);
    if (!data) TE('SOMETHING WENT WRONG WHILE UPDATING');
    const [err1, data1] = await too(events.findOne({ where: { id: id } }));
    if (err1) TE(err1.message);
    if (!data1) TE('SOMETHING WENT WRONG WHILE UPDATING');
    return data1;
  } catch (error) {
    TE(error.message);
  }
};

export const deleteEvent = async id => {
  try {
    const [err, data] = await too(events.destroy({ where: { id: id } }));
    if (err) TE(err.message);
    if (!data) TE('SOMETHING WENT WRONG WHILE DELETING');
    return data;
  } catch (error) {
    TE(error.message);
  }
};
