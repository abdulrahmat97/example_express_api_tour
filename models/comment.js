const moment = require('moment')

module.exports = (sequelize, dataType) => {
  const Comment = sequelize.define('comment', {
    tour_id: {
      type: dataType.BIGINT,
      allowNull: false,
      references: {
        model: 'Tour',
        key: 'id'
      },
    },
    user_id: {
      type: dataType.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
    },
    comment: {
      type: dataType.TEXT,
      allowNull: false,
      defaultValue: '',
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

  Comment.associate = function (models) {
    Comment.belongsTo(models.Tour, {as: 'tour', foreignKey: 'tourId'})
    Comment.belongsTo(models.User, {as: 'by', foreignKey: 'userId'})
  }
  Comment.prototype.display = function () {
    return this.get({ plain: true })
  }

  return Comment
}