const { sender } = require('./emailConfig')
const FROM = `Team TOUR <${sender}>`

module.exports.emailData = ( type, params = {}) => {
  switch (type) {
    // verification account email
    case 'verifyAccount': return {
      from: FROM,
      to: params.email,
      subject: 'Verify your email address',
      html: `<p>click link below to verify your email address <a href="${params.link}">Click</a> </p>`,
    }
    // reset password email
    case 'resetPassword': return {
      from: FROM,
      to: params.email,
      subject: 'reset your password',
      html: `<p>click link below to reset your password <a href="${params.link}">Click here</a> </p>`
    }
  }
}