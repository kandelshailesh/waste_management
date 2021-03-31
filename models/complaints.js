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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      slug: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        get: function () {
          const images = this.getDataValue('image');
          if (images) return JSON.parse(images);
        },
        set: function (value) {
          if (value) this.setDataValue('image', JSON.stringify(value));
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: {
          isIn: {
            args: [['pending', 'resolved']],
            msg: 'Status must be pending or resolved',
          },
        },
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
    this.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
  };
  return Model;
};
