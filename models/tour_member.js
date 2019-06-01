const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const TourMember = sequelize.define('TourMember', {
    tourId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Tour',
        key: 'id'
      },
    },
    memberId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    getterMethods: {
      createdAt() {
        return moment(this.getDataValue('createdAt')).format()
      },
      updatedAt() {
        return moment(this.getDataValue('updatedAt')).format()
      },
    },
  })

  TourMember.prototype.display = function () {
    return this.get({plain: true})
  }

  TourMember.associate = (models) => {
    TourMember.belongsTo(models.User, {as: 'member', foreignKey: 'memberId'})
    TourMember.belongsTo(models.Tour, {as: 'tour', foreignKey: 'tourId'})
  }
  return TourMember
}
