const nodemailer = require('nodemailer')
const { emailConfig, emailData } = require('../config')

const options = {
  service: emailConfig.service,
  host: emailConfig.host,
  auth: {
    type: emailConfig.type,
    user: emailConfig.email,
    password: emailConfig.password,
    clientId: emailConfig.clientId,
    clientSecret: emailConfig.clientSecret,
    refreshToken: emailConfig.refreshToken,
    accessToken: emailConfig.accessToken,
  }
}

module.exports.nodeMail = nodemailer.createTransport(options)
module.exports.emailData = emailData