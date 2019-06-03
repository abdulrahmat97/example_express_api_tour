const router = require('express').Router()
const {
    index,
    show,
    update,
    store,
    destroy
} = require('../controllers/member')

router.get('/', index)
router.get('/:id', show)
router.post('/', store)
router.put('/:id', update)
router.delete('/:id', destroy)

module.exports = router