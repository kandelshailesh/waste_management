//import system_modules from "../../auth_models/system_modules";
import {
  createEvent,
  deleteEvent,
  getEvent,
  updateEvent,
} from '../services/events';

const { too, ReS, ReE, TE } = require('../services/util');
const { status_codes_msg } = require('../utils/appStatics');
const Logger = require('../logger');

export const createEventController = async (req, res) => {
  const param = req.body;

  try {
    const [err, newEvent] = await too(createEvent(param));
    if (err) {
      ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (newEvent) {
      ReS(
        res,
        {
          message: 'NEW EVENT ADDED',
          DATA: newEvent,
        },
        status_codes_msg.CREATED.code,
      );
    }
  } catch (error) {
    ReE(res, error.message, status_codes_msg.FAILED.code);
  }
};

export const getEventController = async (req, res) => {
  const param = req.query;
  try {
    const [err, packageByKey] = await too(getEvent(param));

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

export const updateEventController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const [err, updatedEvent] = await too(updateEvent(body, id));
    console.log(updatedEvent);

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (updatedEvent) {
      return ReS(
        res,
        {
          message: `DATA UPDATED`,
          DATA: updatedEvent,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};

export const deleteEventController = async (req, res) => {
  const { id } = req.params;
  try {
    const [err, deletedEvent] = await too(deleteEvent(id));

    if (err) {
      return ReE(res, err, status_codes_msg.FAILED.code);
    }
    if (deletedEvent) {
      return ReS(
        res,
        {
          message: `EVENT DELETED`,
          DATA: deletedEvent,
        },
        status_codes_msg.SUCCESS.code,
      );
    }
  } catch (error) {
    return ReE(res, error, status_codes_msg.FAILED.code);
  }
};
