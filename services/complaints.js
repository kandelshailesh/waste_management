import { sequelize } from '../models';

const { complaints, users } = require('../models');
const { too, ReS, ReE, TE, paginate, deleteFile } = require('./util');
const omit = require('lodash/omit');
const lodash = require('lodash');
const { STRINGS } = require('../utils/appStatics');
const cleanDeep = require('clean-deep');

export const createComplaint = async param => {
  try {
    const [err, data] = await too(complaints.create(param));
    if (err) return TE(err.message);
    if (data) return data;
  } catch (error) {
    return TE(error.message);
  }
};

export const getComplaint = async param => {
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
        complaints.findAndCountAll({
          where: Object.keys(query).length > 0 ? query : '',
          ...paginate(page, limit),
          include: [{ model: users }],
        }),
      );
    } else {
      [err, allModules] = await too(
        complaints.findAndCountAll({
          attributes: [
            'createdAt',
            [sequelize.fn('count', sequelize.col('id')), 'total'],
          ],
          group: sequelize.fn('DATE', sequelize.col('createdAt')),
          // 'createdAt',
        }),
      );
    }

    if (err) TE(err.message);
    if (!allModules) TE('SOMETHING WENT WRONG WHILE FETCHING');
    return allModules;
  } catch (error) {
    TE(error.message);
  }
};

export const updateComplaint = async (param, id) => {
  try {
    let err, data;
    const { image, deletedImage, ...restParams } = JSON.parse(
      JSON.stringify(param),
    );
    [err, data] = await too(complaints.findOne({ where: { id } }));

    if (err) {
      if (param.image) deleteFile(param.image);
      TE(STRINGS.DB_ERROR + err.message);
    }
    if (!data) {
      if (param.image) deleteFile(param.image);
      TE(STRINGS.NO_DATA);
    }
    Object.entries(restParams).map(([key, value]) => {
      data[key] = value;
    });
    // if (param.deletedImage) {
    //   if (param.deletedImage.length > 0) {
    //     const newarray = data.image;
    //     await Promise.all(
    //       param.deletedImage.map(async i => {
    //         const a = lodash.remove(newarray, function (e) {
    //           return e === i;
    //         });
    //       }),
    //     );
    //     data.image = newarray;
    //   }
    // }
    // if (param.image) {
    //   let img = data.image;
    //   param.image.forEach(e => {
    //     img.push(e.path);
    //   });
    //   data.image = img;
    // }
    console.log('lklk', data);
    const a = await data.save();
    return a;
  } catch (error) {
    TE(error.message);
  }
};

export const deleteComplaint = async id => {
  try {
    const [err, data] = await too(complaints.destroy({ where: { id: id } }));
    if (err) TE(err.message);
    if (!data) TE('SOMETHING WENT WRONG WHILE DELETING');
    return data;
  } catch (error) {
    TE(error.message);
  }
};
