//import system_modules from "../../auth_models/system_modules";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  updateEmployee,
} from '../services/employee';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createEmployeeController = async (req, res) => {
  const param = req.body;

  try {
    const [err, newEmployee] = await too(createEmployee(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newEmployee) {
      ReS(
        res,
        {
          message: 'NEW EMPLOYEE ADDED',
          DATA: newEmployee,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getEmployeeController = async (req, res) => {
  const param = req.query;
  try {
    const [err, packageByKey] = await too(getEmployee(param));

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

export const updateEmployeeController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const [err, updatedEmployee] = await too(updateEmployee(body, id));
    console.log(updatedEmployee);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedEmployee) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedEmployee,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteEmployeeController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedEmployee] = await too(deleteEmployee(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedEmployee) {
      return ReS(
        res,
        {
          message: `EMPLOYEE DELETED`,
          DATA: deletedEmployee,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
