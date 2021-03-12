module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'subscription_plan',
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
      },
      details: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cost: {
        type: DataTypes.INTEGER(11),
        default: 0,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      unit: {
        type: DataTypes.ENUM,
        values: ['days', 'months', 'years'],
      },
      status: {
        type: DataTypes.ENUM,
        values: ['active', 'hold'],
        allowNull: false,
        default: 'active',
      },
      plan_id: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      tableName: 'subscription_plan',
    },
  );

  Model.associate = function (models) {};
  return Model;
};
