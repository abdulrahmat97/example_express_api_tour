const router = require('express').Router()
const {
    session,
    login,
    register,
    forgetPassword,
    resetPassword,
    logout,
} = require('../controllers/session')
const { auth } = require('../utils/middleware')

router.get('/', session)
router.post('/', login)
router.delete('/', auth, logout)
router.post('/register', register)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)
router.post('/register', register)

module.exports = router