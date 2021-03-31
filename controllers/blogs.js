//import system_modules from "../../auth_models/system_modules";
import { createBlog, deleteBlog, getBlog, updateBlog } from '../services/blogs';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createBlogController = async (req, res) => {
  const param = req.body;

  if (req.files) {
    param.image = req.files['image'] ? req.files['image'][0].path : null;
  }

  try {
    const [err, newBlog] = await too(createBlog(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newBlog) {
      ReS(
        res,
        {
          message: 'NEW BLOG ADDED',
          DATA: newBlog,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getBlogController = async (req, res) => {
  try {
    const param = req.query;

    const [err, packageByKey] = await too(getBlog(param));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (packageByKey) {
      return ReS(
        res,
        {
          message: `FETCH SUCCESSFULLY`,
          DATA: packageByKey.rows,

          count: packageByKey.count,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const updateBlogController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    if (req.files) {
      body.image = req.files['image'] ? req.files['image'][0].path : null;
    }
    const [err, updatedBlog] = await too(updateBlog(body, id));
    console.log(updatedBlog);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedBlog) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedBlog,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteBlogController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedBlog] = await too(deleteBlog(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedBlog) {
      return ReS(
        res,
        {
          message: `BLOG DELETED`,
          DATA: deletedBlog,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
