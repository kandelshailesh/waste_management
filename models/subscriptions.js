const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'subscriptions',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args: true,
          msg: 'User already have a subscription',
        },
      },
      activation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      renewal_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
        validate: {
          isIn: {
            args: [['active', 'expired']],
            msg: 'Status must be active or expired',
          },
        },
      },
    },
    {
      paranoid: true,
      tableName: 'subscriptions',
    },
  );

  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
    this.belongsTo(models.packages, {
      foreignKey: 'package_id',
      targetKey: 'id',
    });
  };
  return Model;
};
