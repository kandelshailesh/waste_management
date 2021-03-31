module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'packages',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          args: true,
          msg: 'Name already exist',
        },
      },
      details: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cost: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit: {
        type: DataTypes.ENUM,
        values: ['days', 'months', 'years'],
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
        validate: {
          isIn: {
            args: [['active', 'hold']],
            msg: 'Status must be active or hold',
          },
        },
      },
      plan_id: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      tableName: 'packages',
    },
  );

  Model.associate = function (models) {
    this.hasMany(models.subscriptions, {
      foreignKey: 'package_id',
      sourceKey: 'id',
    });
  };
  return Model;
};
