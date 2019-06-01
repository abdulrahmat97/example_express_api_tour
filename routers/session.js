const router = require('express').Router()
const {
    login,
    session,
    logout,
} = require('../controllers/session')

router.get('/', session)
router.post('/', login)
router.delete('/', logout)

module.exports = router