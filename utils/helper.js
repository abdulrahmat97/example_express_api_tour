const crypto = require('crypto')
const moment = require('moment')

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
module.exports.validEmail = email => emailRegex.test(String(email).toLowerCase())

module.exports.randomString = (length = 8) => crypto.randomBytes(length).toString('hex')
