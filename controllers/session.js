const moment = require('moment')
const { Session, User, Member, sequelize } = require('../models')
const { ROLE } = require('../config/index')
const { validEmail, randomString } = require('../utils/helper')

module.exports.session = async (req, res, next) => {
   try {
    const auth = req.get('Authorization')
    if (typeof auth === 'undefined' || auth === null) {
      throw new Error('010002')
    }

    const session = await Session.findOne({ where: { token: auth } })
    if (!session) throw new Error('010002')

    // session expired
    if (moment(session.expiry).isBefore(moment())) {
      await session.destroy()
      throw new Error('010005')
    }

    // get user access admin or member
    const user = await User.userAccess(session)
    if (!user) throw new Error('010101')

    res.json(user.display())
   } catch(e) {
     next(e)
   }
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body

    if (!email) throw new Error('email is required')
    if (!password) throw new Error('password is required')

    const user = await User.validatePassword(email, password)
    if (!user) throw new Error('010101')

    user.lastLogin = moment()
    user.save()

    // generate token
    const accessToken = await Session.generateAccess(user, remember)
    res.json({ accessToken, ...user.display() })
  } catch(e) {
    next(e)
  }
}

module.exports.register = async (req, res, next) => {
  let transaction = null
  try {
    const { email, username, name, password, role } = req.body

    if (!username) throw new Error('username is required')
    if (!email) throw new Error('Email is required')
    if (!name) throw new Error('name is required')
    if (!password) throw new Error('password is required')

    transaction = await sequelize.transaction()

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ where: { email }, transaction }),
      User.findOne({ where: { username }, transaction }),
    ])

    if (existingEmail) throw new Error('Email is already used')
    if (existingUsername) throw new Error('username is already used')

    const user = await User.create({
      email,
      username,
      password,
      role: role || ROLE.MEMBER
    }, { transaction })

    const member = await Member.create({
      name,
      userId: user.id
    }, { transaction })

    await transaction.commit()

    res.json(member.display())

  } catch(e) {
    if (transaction) await transaction.rollback()
    next(e)
  }
}

module.exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) throw new Error('Email is required')
    if (!validEmail(email)) throw new Error('invalid email format')

    // searhc email
    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error('email is not registered')

    user.resetPasswordToken = randomString(20)
    user.resetPasswordExpiry = moment().add(5, 'minutes')

    // send reset password token with email
    //

    await user.save()
    res.json({status: 'done', token: user.resetPasswordToken})
  } catch(e) {
    next(e)
  }
}

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { password, resetToken } = req.body

    if (!password) throw new Error('password is required')
    if (!resetToken) throw new Error('010004')

    const user = await User.findOne({ where: {
      resetPasswordToken: resetToken
    }})

    if (!user) throw new Error('Reset password token is invalid')

    if (moment(user.resetPasswordExpiry).isBefore(moment())) {
      throw new Error('reset password token is expired')
    }

    user.password = password
    user.save()

    res.json({status: 'done'})
  } catch(e) {
    next(e)
  }
}

module.exports.logout = async (req, res, next) => {
  try {
    const auth = req.get('Authorization')

    if (typeof auth === 'undefined' || auth === null) {
      throw new Error('010002')
    }

    await Session.destroy({ where: { token: auth } })

    res.json({ status: 'done' })
  } catch (err) {
    next(err)
  }
}
