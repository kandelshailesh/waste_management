const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequlize, DataTypes) => {
  let Model = sequlize.define(
    'schedules',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      collection_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'uncollected',
        validate: {
          isIn: {
            args: [['collected', 'uncollected']],
            msg: 'Status must be collected or uncollected',
          },
        },
      },
    },
    {
      paranoid: true,
      tableName: 'schedules',
    },
  );

  SequelizeSlugify.slugifyModel(Model, {
    source: ['title'],
  });
  Model.associate = function (models) {
    this.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return Model;
};
