/* jshint indent: 2 */
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, too } = require('../services/util');
const randtoken = require('rand-token');
const SequelizeSlugify = require('sequelize-slugify');

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(255),
        unique: {
          args: true,
          msg: 'Username already exist',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: 'Email already exist',
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          args: true,
          msg: 'Phone number already exist',
        },
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['active', 'hold'],
        defaultValue: 'active',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remember_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subscribed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ['male', 'female', 'other'],
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpiresIn: DataTypes.DATE,
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { paranoid: true, tableName: 'users' },
  );
  SequelizeSlugify.slugifyModel(Model, {
    source: ['username'],
  });
  Model.associate = function (models) {
    this.belongsTo(models.packages, {
      foreignKey: 'subscription_id',
      targetKey: 'id',
    });
    this.hasMany(models.blogs, {
      foreignKey: 'author_id',
      sourceKey: 'id',
    });
    this.hasMany(models.events, {
      foreignKey: 'author_id',
      sourceKey: 'id',
    });
    this.hasMany(models.complaints, {
      foreignKey: 'user_id',
      sourceKey: 'id',
    });
    this.hasMany(models.schedules, {
      foreignKey: 'user_id',
      sourceKey: 'id',
    });
    this.hasMany(models.transaction, {
      foreignKey: 'user_id',
      sourceKey: 'id',
    });
    this.hasOne(models.subscriptions, {
      foreignKey: 'user_id',
      sourceKey: 'id',
    });
  };

  Model.prototype.getJWT = function () {
    let expiration_time = parseInt(process.env.JWT_EXPIRATION);
    return (
      'Bearer ' +
      jwt.sign({ user_id: this.id }, process.env.JWT_EXPIRATION, {
        expiresIn: expiration_time,
      })
    );
  };

  Model.prototype.decryptPassword = async function (pw) {
    let err, pass;
    console.log('coco', pw);
    console.log('coco', this.password);
    if (!this.password) TE('password not found');
    [err, pass] = await too(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);
    if (!pass) return false;
    return true;
  };

  Model.beforeSave(async user => {
    console.log('hoil', user.password);
    let err;
    if (user.changed('password')) {
      console.log('PAS CHANGED onSave', user.password);
      let salt, hash;
      [err, salt] = await too(bcrypt.genSalt(10));
      if (err) TE(err.message, true);
      console.log(salt);
      [err, hash] = await too(bcrypt.hash(user.password, salt));
      if (err) TE(err.message, true);

      user.password = hash;
      user.passwordChangedAt = Date.now();
    }
    return;
  });

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    delete json.password;
    delete json.createdAt;
    delete json.updatedAt;
    delete json.deleted_at;
    delete json.passwordChangedAt;
    delete json.resetPasswordExpiresIn;
    delete json.resetPasswordToken;
    delete json.lastLoginAt;
    delete json.remember_token;
    delete json.deletedAt;
    return json;
  };

  Model.prototype.comparePassword = async function (pw) {
    let err, pass;
    if (!this.password) TE('password not set');

    [err, pass] = await too(bcrypt.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('Current password didnot match');
    return this;
  };

  Model.prototype.verifyPassword = async function (pw) {
    let err, salt, pass, hash;
    if (!this.password) TE('password not set');

    [err, salt] = await too(bcrypt.genSalt(10));
    if (err) TE(err.message, true);

    [err, hash] = await too(bcrypt.hash(pw, salt));
    if (err) TE(err.message, true);

    [err, pass] = await too(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('Invalid password');

    return this;
  };
  return Model;
};
