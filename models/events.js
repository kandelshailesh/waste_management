const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'events',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(255),
        unique: true,
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
      tableName: 'events',
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
