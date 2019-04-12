const router = require('express').Router()
const {
    index,
    show,
    store
 } = require('../controllers/tour')

router.get('/', index)
router.get('/:id', show)
router.post('/', store)

module.exports = router