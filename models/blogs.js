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
        unique: {
          args: true,
          msg: 'Title already exist',
        },
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(255),
        unique: {
          args: true,
          msg: 'Slug already exist',
        },
      },
      author_id: {
        type: DataTypes.INTEGER,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
