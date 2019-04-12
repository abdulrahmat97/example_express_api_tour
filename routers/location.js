const router = require('express').Router()
const {
  index,
  view,
  store,
  update,
  destroy,
} = require ('../controllers/location')

router.get('/', index)
router.get('/:id', view)
router.post('/', store)
router.put('/:id', update)
router.delete('/:id', destroy)

module.exports = router
