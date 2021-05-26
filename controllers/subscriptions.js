//import system_modules from "../../auth_models/system_modules";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  updateSubscription,
  getSubscriptionByPackage,
} from '../services/subscription';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createSubscriptionController = async (req, res) => {
  const param = req.body;

  try {
    const [err, newSubscription] = await too(createSubscription(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newSubscription) {
      ReS(
        res,
        {
          message: 'NEW SUBSCRIPTION ADDED',
          DATA: newSubscription,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getSubscriptionController = async (req, res) => {
  const param = req.query;
  try {
    const [err, packageByKey] = await too(getSubscription(param));

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

export const getSubscriptionByPackageController = async (req, res) => {
  try {
    const [err, packageByKey] = await too(getSubscriptionByPackage());

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (packageByKey) {
      return ReS(
        res,
        {
          message: `FETCH SUCCESSFULLY`,
          DATA: packageByKey,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const updateSubscriptionController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  console.log('PPP', req.body);
  try {
    const [err, updatedSubscription] = await too(updateSubscription(body, id));
    console.log(updatedSubscription);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedSubscription) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedSubscription,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteSubscriptionController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedSubscription] = await too(deleteSubscription(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedSubscription) {
      return ReS(
        res,
        {
          message: `EVENT DELETED`,
          DATA: deletedSubscription,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
