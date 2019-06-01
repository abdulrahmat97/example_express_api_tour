const CONFIG = require('./config')
const DEFAULT = require('./default')
const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  dbConfig: CONFIG[ENV],
  ...DEFAULT,
}
