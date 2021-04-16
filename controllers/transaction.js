//import system_modules from "../../auth_models/system_modules";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from '../services/transaction';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createTransactionController = async (req, res) => {
  const param = req.body;

  try {
    const [err, newTransaction] = await too(createTransaction(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newTransaction) {
      ReS(
        res,
        {
          message: 'NEW TRANSACTION ADDED',
          DATA: newTransaction,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getTransactionController = async (req, res) => {
  const param = req.query;
  try {
    const [err, packageByKey] = await too(getTransaction(param));

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

export const updateTransactionController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const [err, updatedTransaction] = await too(updateTransaction(body, id));
    console.log(updatedTransaction);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedTransaction) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedTransaction,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteTransactionController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedTransaction] = await too(deleteTransaction(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedTransaction) {
      return ReS(
        res,
        {
          message: `TRANSACTION DELETED`,
          DATA: deletedTransaction,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
