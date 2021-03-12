const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'complaint_image',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      complaint_id: {
        type: DataTypes.INTEGER,
      },
      image_location: {
        type: DataTypes.TEXT,
      },
    },
    {
      paranoid: true,
      tableName: 'complaint_image',
    },
  );

  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'author_id', targetKey: 'id' });
  };
  return Model;
};
