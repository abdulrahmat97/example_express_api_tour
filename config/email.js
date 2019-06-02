const { sender } = require('./emailConfig')
const FROM = `Team TOUR <${sender}>`

module.exports.emailData = (type , link, params = {}) => {
  switch (type) {
    // verification account email
    case 'verifyAccount': return {
      from: FROM,
      subject: 'Verify your email address',
      html: `<p>click link below to verify your email address <a href="${link}">Click</a> </p>`,
    }
    // reset password email
    case 'resetPassword': return {
      from: FROM,
      subject: 'reset your password',
      html: `<p>click link below to reset your password <a href="${link}">Click here</a> </p>`
    }
  }
}