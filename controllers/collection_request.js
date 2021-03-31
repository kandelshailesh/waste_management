//import system_modules from "../../auth_models/system_modules";
import {
  createCollectionRequest,
  deleteCollectionRequest,
  getCollectionRequest,
  updateCollectionRequest,
} from '../services/collection_request';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createCollectionRequestController = async (req, res) => {
  const param = req.body;

  try {
    const [err, newCollectionRequest] = await too(
      createCollectionRequest(param),
    );
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newCollectionRequest) {
      ReS(
        res,
        {
          message: 'NEW COLLECTION REQUEST ADDED',
          DATA: newCollectionRequest,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getCollectionRequestController = async (req, res) => {
  const param = req.query;
  try {
    const [err, packageByKey] = await too(getCollectionRequest(param));

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

export const updateCollectionRequestController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const [err, updatedCollectionRequest] = await too(
      updateCollectionRequest(body, id),
    );
    console.log(updatedCollectionRequest);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedCollectionRequest) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedCollectionRequest,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteCollectionRequestController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedCollectionRequest] = await too(
      deleteCollectionRequest(id),
    );

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedCollectionRequest) {
      return ReS(
        res,
        {
          message: `COLLECTION REQUEST DELETED`,
          DATA: deletedCollectionRequest,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
