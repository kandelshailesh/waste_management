//import system_modules from "../../auth_models/system_modules";
import {
  createComplaint,
  deleteComplaint,
  getComplaint,
  updateComplaint,
} from '../services/complaints';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createComplaintController = async (req, res) => {
  const param = req.body;

  if (req.files) {
    param.image = req.files['image'] ? req.files['image'] : null;
  }

  try {
    const [err, newComplaint] = await too(createComplaint(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newComplaint) {
      ReS(
        res,
        {
          message: 'NEW COMPLAINT ADDED',
          DATA: newComplaint,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getComplaintController = async (req, res) => {
  try {
    const param = req.query;

    const [err, packageByKey] = await too(getComplaint(param));

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

export const updateComplaintController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    if (req.files) {
      body.image = req.files['image'] ? req.files['image'] : null;
    }
    const [err, updatedComplaint] = await too(updateComplaint(body, id));
    console.log(updatedComplaint);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedComplaint) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedComplaint,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteComplaintController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedComplaint] = await too(deleteComplaint(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedComplaint) {
      return ReS(
        res,
        {
          message: `COMPLAINT DELETED`,
          DATA: deletedComplaint,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
