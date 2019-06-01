const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lang: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  }, {
    paranoid: true,
    getterMethods: {
      createdAt() {
        return moment(this.getDataValue('createdAt')).format()
      },
      updatedAt() {
        return moment(this.getDataValue('updatedAt')).format()
      },
    },
  })

  Location.prototype.display = function () {
    const {
      deletedAt,
      ...location
    } = this.get({ plain: true })
    return location
  }

  Location.associate = function (models) {
    Location.hasOne(models.Tour)
  }


  return Location
}
