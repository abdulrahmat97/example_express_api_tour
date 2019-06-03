const moment = require('moment')
const { ROLE } = require('../config/index')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 255],
          msg: 'Email max 255 character'
        }
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(password) {
        this.setDataValue('password', sequelize.fn('crypt', password, sequelize.fn('gen_salt', 'md5')))
      },
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resetPasswordToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    resetPasswordExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ROLE.MEMBER,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return moment(this.getDataValue('lastLogin')).format()
      },
    },
    verificationEmailToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verificationEmailTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verifyAt: {
      type: DataTypes.DATE,
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
      }
    }
  })

  User.associate = function (models) {
    User.hasOne(models.Tour)
    User.hasMany(models.TourMember, {as: 'tourMember', foreignKey: 'memberId'})
    User.hasOne(models.Member, {as: 'member', foreignKey: 'userId'})
    User.hasOne(models.Admin, {as: 'admin', foreignKey: 'userId'})
  }

  User.prototype.display = function () {
    const {
      verificationEmailToken,
      verificationEmailTokenExpiry,
      verifyAt,
      password,
      resetPasswordToken,
      resetPasswordExpiry,
      deletedAt,
      ...user
    } = this.get({ plain: true })
    return user
  }

  User.validatePassword = (email, password) => {
    return User.findOne({
      where: {
        email,
        password: sequelize.fn('crypt', password, sequelize.col('password'))
      }
    })
  }

  User.userAccess = (session) => {
    if (session.role === ROLE.MEMBER) {
      return User.findByPk(session.userId, {
        include: [{
          model: sequelize.models.Member,
          as: 'member',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt']
          }
        }]
      })
    } else {
      return User.findByPk(session.userId, {
        include: [{
          model: sequelize.models.Admin,
          as: 'admin',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt']
          }
        }]
      })
    }
  }

  User.removeAccount = async (userAccount) => {
    try {
      const memberAccount = await sequelize.models.Member.findOne({ where: { userId: userAccount.id } })

      await Promise.all([
        memberAccount.destroy({ force: true }),
        userAccount.destroy({ force: true }),
      ])

      return
    } catch(e) {
      throw new Error('remove Account Error :', e)
    }
  }

  return User
}