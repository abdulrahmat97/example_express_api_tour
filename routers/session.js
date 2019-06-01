const router = require('express').Router()
const {
    login,
    register,
    session,
    logout,
} = require('../controllers/session')
const { auth } = require('../utils/middleware')

router.get('/', session)
router.post('/', login)
router.delete('/', auth, logout)
router.post('/register', register)

module.exports = router