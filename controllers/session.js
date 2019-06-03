const moment = require('moment')
const { Session, User, Member, sequelize } = require('../models')
const { ROLE, clientUrl } = require('../config/index')
const { validEmail, randomString, increaseDays } = require('../utils/helper')

const { nodeMail, emailData } = require('../utils/email')

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
    if (!user.status) throw new Error('Please verification your account')
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
    if (!validEmail(email)) throw new Error('invalid Email format')
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
      role: role || ROLE.MEMBER,
      verificationEmailToken: randomString(50),
      verificationEmailTokenExpiry: increaseDays(2)
    }, { transaction })

    const member = await Member.create({
      name,
      userId: user.id
    }, { transaction })

    await transaction.commit()

     // send account-verification with email
    const link = `${clientUrl}/verify-account?verification_code=${user.verificationEmailToken}`
    const emailDetail = emailData('verifyAccount', link)

    nodeMail.sendMail({
      to: email,
      ...emailDetail,
    }).then(() => {
      // ignoring process send email and view response
      console.log('emaill sender success')
    }).catch((e) => {
      console.log(e)
    })

    res.json(member.display())

  } catch(e) {
    if (transaction) await transaction.rollback()
    next(e)
  }
}

module.exports.verifyAccount = async (req, res, next) => {
  try {
    const { code } = req.body

    if (!code) throw new Error('there is no code verification in the request')

    // search code in user
    const user = await User.findOne({ where: { verificationEmailToken: code } })
    if (!user) throw new Error('verification code invalid')

    // if code was verified
    if (!!user.verifyAt && user.verificationEmailToken === null) {
      throw new Error('the account has been confirmed')
    }

    // check expired code
    if (moment(user.verificationEmailTokenExpiry).isBefore(moment())) {
      // remove account if verification code expired
      await User.removeAccount(user)
      throw new Error('verification code is expired, please try again create account')
    }

    // update account if success
    sequelize.options.omitNull = false
    await user.update({
      verificationEmailToken: null,
      verificationEmailTokenExpiry: null,
      status: true,
      verifyAt: moment(),
    })
    sequelize.options.omitNull = true

    res.json({ status: 'done' })
  } catch(e) {
    next(e)
  }
}

module.exports.resendVerifyAccoount = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) throw new Error('email is required')
    if (!validEmail(email)) throw new Error('invalid email format')

    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error('Unregistered users please create a new user')
    if (!!user.verifyAt) throw new Error('this account has been actived')

    // update verification code
    await user.update({
      verificationEmailToken: randomString(50),
      verificationEmailTokenExpiry: increaseDays(2)
    })

    // send account-verification with email
    const link = `${clientUrl}/verify-account?verification_code=${user.verificationEmailToken}`
    const emailDetail = emailData('verifyAccount', link)

    nodeMail.sendMail({
      to: email,
      ...emailDetail,
    }).then(() => {
      // ignoring process send email and view response
      console.log('emaill sender success')
    }).catch((e) => {
      console.log(e)
    })

    res.json({ status: 'done' })
  } catch(e) {
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
    await user.save()

    // send reset password token with email
    const link = `${clientUrl}/reset-password?resetToken=${user.resetPasswordToken}`
    const emailDetail = emailData('resetPassword', link)

    nodeMail.sendMail({
      to: email,
      ...emailDetail,
    }).then(() => {
      // ignoring process send email and view response
      console.log('emaill sender success')
    }).catch((e) => {
      console.log(e)
    })

    res.json({ status: 'done' })
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

    res.json({ status: 'done' })
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
