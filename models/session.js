const moment = require('moment')
const { randomString } = require('../utils/helper')
const { ROLE, EXPIRY_SESSION } = require('../config/index')

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'active'
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ROLE.MEMBER
    },
  }, {
    getterMethods: {
      createdAt() {
        return moment(this.getDataValue('createdAt')).format()
      },
      updatedAt() {
        return moment(this.getDataValue('updatedAt')).format()
      },
    }
  })

  Session.prototype.display = () => {
     return this.get({ plain: true })
  }

  Session.associate = (models) => {
    Session.belongsTo(models.User, { as: 'user' })
  }

  Session.generateAccess = async ({id: userId, role, ...params}, remember = false) => {
    let transaction = null
    try {
      transaction = await sequelize.transaction()

      await Session.destroy({ where: { userId }, transaction })
      // update token
      const session = await Session.create(
        {
          userId,
          role,
          token: randomString(100),
          expiry: moment().add(remember ? 300 : EXPIRY_SESSION, 'days')
        },
        { transaction }
      )
      await transaction.commit()

      return session.token
    } catch(e) {
      if (transaction) await transaction.rollback()
      throw new Error('generate access token error')
    }
  }

  return Session
}
