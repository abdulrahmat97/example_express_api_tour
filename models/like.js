const moment = require('moment')

module.exports = (seqeulize, DataTypes) => {
  const Like = seqeulize.define('Like', {
    tourId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Tour',
        key: 'id'
      },
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
    },
  }, {
    getterMethods: {
      createdAt() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD')
      },
      updatedAt() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD')
      },
    },
  })

  Like.associate = function (models) {
    Like.belongsTo(models.Tour, {as: 'tour', foreignKey: 'tourId'})
    Like.belongsTo(models.User, {as: 'likeBy', foreignKey: 'userId'})
  }

  Like.prototype.display = function () {
    this.get({ plain: true })
  }

  return Like
}