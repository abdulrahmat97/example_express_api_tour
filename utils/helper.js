const crypto = require('crypto')
const moment = require('moment')

const { DEFAULT } = require('../config')

module.exports.getYearMonth = (date) => {
  const mDate = (!date) ? moment() : moment(date)
  return {
    year: mDate.year(),
    month: mDate.month() + 1 // because month start from 0
  }
}
