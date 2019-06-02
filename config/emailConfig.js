require('dotenv').config()

module.exports = {
 type: 'OAuth2',
 host: process.env.EMAIL_HOST,
 email: process.env.EMAIL_USER,
 password: process.env.EMAIL_PASSWORD,
 sender: process.env.EMAIL_SENDER,
 service: process.env.EMAIL_SERVICE,
 clientId: process.env.EMAIL_CLIENT_ID,
 clientSecret: process.env.EMAIL_CLIENT_SECRET,
 refreshToken: process.env.EMAIL_REFRESH_TOKEN,
 accessToken: process.env.EMAIL_ACCESS_TOKEN,
}