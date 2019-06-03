const router = require('express').Router()
const {
    session,
    login,
    register,
    verifyAccount,
    resendVerifyAccoount,
    forgetPassword,
    resetPassword,
    logout,
} = require('../controllers/session')
const { auth } = require('../utils/middleware')

router.get('/', auth, session)
router.post('/', login)
router.delete('/', auth, logout)
router.post('/register', register)
router.post('/verify-account', verifyAccount)
router.post('/resend-verify-account', resendVerifyAccoount)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)

module.exports = router