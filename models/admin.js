const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    locale: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'id',
    },
     phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    }
  })

  Admin.prototype.display = function () {
     return this.get({ plain: true })
  }

  Admin.associate = function (models) {
    Admin.belongsTo(models.User, { as: 'user' })
  }

  return Admin
}
