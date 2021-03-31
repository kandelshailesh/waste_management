require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const db = require('./models/index');
const multer = require('multer');
const routes = require('./routes');
const pe = require('parse-error');
const { ReE, to, TE } = require('./services/util');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
const { status_codes_msg } = require('./utils/appStatics');
app.use('/uploads', express.static('uploads'));

const checkConnection = async () => {
  try {
    await db.sequelize.authenticate();
    db.sequelize.sync({ force: false });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

app.use('/api/backend/v1', routes);
app.use('/', function (req, res) {
  res
    .status(status_codes_msg.NO_RECORD_FOUND.code)
    .json(status_codes_msg.NO_RECORD_FOUND);
});

app.use(function (req, res, next) {
  console.log('err.status');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.error('ERROR', err.status);
  return ReE(res, err, status_codes_msg.INVALID_ENTITY.code);
});
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
  checkConnection();
});
