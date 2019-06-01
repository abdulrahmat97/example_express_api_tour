
const moment = require('moment')
const { Session, User } = require('../models')
const { ROLE } = require('../config/index')

module.exports.auth = async (req, res, next) => {
  try {
    const token = req.get('Authorization')

    if ( typeof token === 'undefined' || token === null) {
      throw new Error('010003')
    }

    const session = await Session.findOne({ where: { token } })
    if (!session) throw new Error('010002')

    // session expired
    if (moment(session.expiry).isBefore(moment())) {
      await session.destroy()
      throw new Error('010005')
    }

    const user = await User.userAccess(session)

    // inject user in all router
    req.currentUser = user.display()
    next()
  } catch(e) {
    next(e)
  }
}

module.exports.onlyAdmin = (req, res, next) => {
  if (req.currentUser && req.currentUser.role === ROLE.ADMIN) {
    next()
    return
  }
  next(new Error('010004'))
}