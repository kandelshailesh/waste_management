const { blogs, users } = require('../models');
const { too, ReS, ReE, TE, paginate, deleteFile } = require('./util');
const omit = require('lodash/omit');
const lodash = require('lodash');
const { STRINGS } = require('../utils/appStatics');

export const createBlog = async param => {
  try {
    // if (param.image) {
    //   let img = [];
    //   param.image.forEach(e => {
    //     img.push(e.path);
    //   });
    //   param.image = img;
    // }
    const [err, data] = await too(blogs.create(param));
    if (err) return TE(err.message);
    if (data) return data;
  } catch (error) {
    return TE(error.message);
  }
};

export const getBlog = async param => {
  let page, limit;
  page = parseInt(param['page']);
  limit = parseInt(param['limit']);
  if (!page) page = 1;
  if (!limit) limit = 20;
  const query = omit(param, ['page', 'limit']);
  try {
    const [err, allModules] = await too(
      blogs.findAndCountAll({
        where: Object.keys(query).length > 0 ? query : '',
        ...paginate(page, limit),
        include: [{ model: users }],
      }),
    );
    if (err) TE(err.message);
    if (!allModules) TE('SOMETHING WENT WRONG WHILE FETCHING');
    return allModules;
  } catch (error) {
    TE(error.message);
  }
};

export const updateBlog = async (param, id) => {
  try {
    let err, data;
    [err, data] = await too(blogs.findOne({ where: { id } }));
    const { deletedImage, ...restParams } = JSON.parse(JSON.stringify(param));

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

    const a = await data.save();
    return a;
  } catch (error) {
    TE(error.message);
  }
};

export const deleteBlog = async id => {
  try {
    const [err, data] = await too(blogs.destroy({ where: { id: id } }));
    if (err) TE(err.message);
    if (!data) TE('SOMETHING WENT WRONG WHILE DELETING');
    return data;
  } catch (error) {
    TE(error.message);
  }
};
