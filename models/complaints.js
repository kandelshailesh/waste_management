const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'complaints',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.DATE,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
      },
      slug: {
        type: DataTypes.TEXT,
      },
    },
    {
      paranoid: true,
      tableName: 'complaints',
    },
  );

  SequelizeSlugify.slugifyModel(Model, {
    source: ['title'],
  });
  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'author_id', targetKey: 'id' });
  };
  return Model;
};
