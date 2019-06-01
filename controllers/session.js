const moment = require('moment')
const { Session, User, Member, sequelize } = require('../models')
const { ROLE } = require('../config/index')

module.exports.session = async (req, res, next) => {
   try {
    const auth = req.get('Authorization')
    if (typeof auth === 'undefined' || auth === null) {
      throw new Error('010002')
    }

    const session = await Session.findOne({ where: { token: auth } })
    if (!session) throw new Error('010002')

    // session expired
    if (session.expiry < moment()) {
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
