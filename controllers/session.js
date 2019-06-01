const moment = require('moment')
const { Session, User, sequelize } = require('../models')

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