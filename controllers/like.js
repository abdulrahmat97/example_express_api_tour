const { Like, Op } = require('../models')

module.exports.index = async (req, res, next) => {
    const result = await Like.findAndCountAll()
    res.json({
      list: result.rows.map(like => like.display()),
      total: result.count,
    })
}

module.exports.view =  async (req, res, next) => {
    const result = await Like.findOne({
      where: {id: req.params.id}
    })
    res.json({
        list: result.display(),
        total: result.count,
    })
}

module.exports.store =  async (req, res, next) => {
  try {
    const {
      userId,
      tourId,
     } = req.body

     if(!userId) throw new Error('userId field is required')
     if(!tourId) throw new Error('tourId field is required')

     const like = await Like.create({
       userId,
      tourId,
    })

    res.json({
      result: like.display()
    })
  } catch (e) {
    next(e)
  }

}

module.exports.update =  async (req, res, next) => {
  try {
    const {  userId, tourId } = req.body

    const like = await Like.findByPk(req.params.id)

    if(!like) throw new Error('location not found')
    await like.update({
      userId, tourId
    })

    res.json(location.display())

  } catch (e) {
    next(e)
  }
}

module.exports.destroy = async (req, res, next) => {
  try {
    const like = await Like.findByPk(req.params.id)
    await like.destroy()
    res.json({ status: 'done' })
  } catch (e) {
    next(e)
  }
}