module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'transaction',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      plan_id: {
        type: DataTypes.STRING,
      },
      comment: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      paid_amount: {
        type: DataTypes.DOUBLE,
      },
      paid_at: {
        type: DataTypes.DATE,
      },
    },
    {
      paranoid: true,
      tableName: 'transaction',
    },
  );

  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return Model;
};
