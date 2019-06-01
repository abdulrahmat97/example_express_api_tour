const { Like, Tour, sequelize, Op } = require('../models')

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
  let transaction = null
  try {
    const { userId, tourId } = req.body

     transaction = await sequelize.transaction()

     if(!userId) throw new Error('userId field is required')
     if(!tourId) throw new Error('tourId field is required')

     const like = await Like.create({
      userId,
      tourId,
    }, { transaction })

    const tour = await Tour.findByPk(tourId, { transaction })

    await tour.update({
      like: tour.like + 1
    }, { transaction })

    await transaction.commit()

    res.json({
      result: like.display()
    })
  } catch (e) {
    if (transaction) await transaction.rollback()
    next(e)
  }

}

module.exports.update =  async (req, res, next) => {
  try {
    const { userId, tourId } = req.body

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
  let transaction = null
  try {
    transaction = await sequelize.transaction()

    const like = await Like.findByPk(req.params.id, { transaction })
    const tour = await Tour.findByPk(like.tourId, { transaction })

    await tour.update({
      like: tour.like - 1
    }, { transaction })

    await like.destroy({ transaction })

    await transaction.commit()

    res.json({ status: 'done' })
  } catch (e) {
    if (transaction) await transaction.rollback()
    next(e)
  }
}