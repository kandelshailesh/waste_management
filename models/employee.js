/* jshint indent: 2 */
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, too } = require('../services/util');
const randtoken = require('rand-token');

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define(
    'employee',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      post: {
        type: DataTypes.STRING(20),
      },
      type: {
        type: DataTypes.ENUM,
        values: ['normal', 'pickup'],
      },
      status: {
        type: DataTypes.ENUM,
        values: ['active', 'hold'],
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ['male', 'female', 'other'],
        allowNull: true,
      },
    },
    { paranoid: true, tableName: 'employee' },
  );

  Model.associate = function (models) {};

  return Model;
};
