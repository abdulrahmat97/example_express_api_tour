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
    // jika memiliki deleted_at field maka akan menjadi soft delete
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
    // mengganti format menjadi plain object (optional)
    const {
      deletedAt,
      ...location
    } = this.get({ plain: true })
    return location
  }

  Location.associate = function (models) {
    // artinya loacationId ada di model tour
    Location.hasOne(models.Tour)
  }


  return Location
}
