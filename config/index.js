const CONFIG = require('./config')
const DEFAULT = require('./default')
const EMAIL_CONFIG = require('./emailConfig')
const { emailData } = require('./email')
const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  clientUrl: process.env.CLIENT_BASE_URL,
  dbConfig: CONFIG[ENV],
  emailConfig: EMAIL_CONFIG,
  emailData, //function
  ...DEFAULT,
}
