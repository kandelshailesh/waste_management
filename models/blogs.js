const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'blogs',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(255),
        unique: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
      tableName: 'blogs',
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
