const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define('Tour', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
  },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateStart: {
      type: DataTypes.DATEONLY,
    },
    dateEnd: {
      type: DataTypes.DATEONLY,
    },
    description: {
      type: DataTypes.DATEONLY,
    },
    like: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    comment: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    paranoid: true,
    getterMethods: {
      createdAt() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD')
      },
      updatedAt() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD')
      },
    },
  })

  //  selain untuk mengubah objek menjadi plaintext (POJO) script dibawah ini juga
  //   bisa menyembunyikan beberapa field
  Tour.prototype.display = function () {
    const {
      deletedAt,
      ...tour
    } = this.get({ plain: true })

    return tour
  }

  Tour.associate = function (models) {
    // boleh pakai foreignKey atau tidak pakai
    Tour.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    Tour.belongsTo(models.Location, { as: 'location', foreignKey: 'locationId' })

    Tour.hasMany(models.TourMember)
  }

  return Tour
}
