const message = require('../config/message')

const template = (error, status) => {
  // error is an object
  if (typeof error.message !== 'undefined') {
    // can find matched message
    if (typeof message[error.message] !== 'undefined') {
      // translate the error
      return [{
        code: parseInt(message[error.message].code, 10),
        type: error.message,
        message: message[error.message].message,
      }, parseInt(message[error.message].code, 10)]
    }

    // return error itself
    return [{
      code: status,
      type: error.type,
      message: error.message,
    }, status]
  }

  // error is a string and matched in message
  if (typeof message[error] !== 'undefined') {
    // translate the error
    return [{
      code: parseInt(message[error].code, 10),
      type: error,
      message: message[error].message,
    }, parseInt(message[error].code, 10)]
  }

  // undefined error
  return [{
    code: 500,
    message: error,
  }, 500]
}

// if error more than one, take first only
const response = (error) => {
  // pre-defined error object
  if (
    typeof error.type !== 'undefined' &&
    error.type !== null &&
    typeof error.message !== 'undefined' &&
    error.message !== null
  ) {
    return [Object.assign({ code: 400 }, error), (error.code || 400)]
  }

  if (error === 'timeout') {
    return [{
      code: 500,
      message: error,
    }, 500]
  }

  return template((error.details || error.message), 400)
}

module.exports = response
