//import system_modules from "../../auth_models/system_modules";
import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  updateSchedule,
} from '../services/schedules';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createScheduleController = async (req, res) => {
  const param = req.body;

  try {
    const [err, newSchedule] = await too(createSchedule(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newSchedule) {
      ReS(
        res,
        {
          message: 'NEW SCHEDULE ADDED',
          DATA: newSchedule,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getScheduleController = async (req, res) => {
  const param = req.query;
  try {
    const [err, packageByKey] = await too(getSchedule(param));

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

export const updateScheduleController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const [err, updatedSchedule] = await too(updateSchedule(body, id));
    console.log(updatedSchedule);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedSchedule) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedSchedule,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteScheduleController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedSchedule] = await too(deleteSchedule(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedSchedule) {
      return ReS(
        res,
        {
          message: `SCHEDULE DELETED`,
          DATA: deletedSchedule,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
