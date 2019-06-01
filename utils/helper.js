const crypto = require('crypto')
const moment = require('moment')

module.exports.randomString = (length = 8) => crypto.randomBytes(length).toString('hex')

