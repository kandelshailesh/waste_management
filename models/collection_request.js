module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'collection_request',
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
      },
      location: {
        type: DataTypes.STRING(255),
      },
      lat: {
        type: DataTypes.TEXT,
      },
          lng: {
        type: DataTypes.TEXT,
      },
      remarks: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: {
          isIn: {
            args: [['pending', 'closed']],
            msg: 'Status must be pending or closed',
          },
        },
      },
    },
    {
      paranoid: true,
      tableName: 'collection_request',
    },
  );
  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return Model;
};
