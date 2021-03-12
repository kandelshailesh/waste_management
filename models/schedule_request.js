module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'schedule_request',
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
      comment: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      requested_at: {
        type: DataTypes.DATE,
      },
    },
    {
      paranoid: true,
      tableName: 'schedule_request',
    },
  );

  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return Model;
};
