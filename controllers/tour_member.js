const { TourMember, Op } = require('../models')

module.exports.index = async (req, res, next) => {
  try {
    const result = await TourMember.findAndCountAll()

    res.json({
      list : result.rows.map((tourMember) => tourMember.display()),
      total: result.count
    })
  } catch(e) {
    next(e)
  }
}

module.exports.show = async (req, res, next) => {
  try {
    const tourMember = await TourMember.findByPk(req.params.id)
    if (!tourMember) throw new Error('tourMember not found')

    res.json(tourMember.display())
  } catch(e) {
    next(e)
  }
}

module.exports.store = async (req, res, next) => {
  try {
    const {
      memberId,
      tourId,
    } = req.body

    if (!memberId) throw new Error('memberId is required')
    if (!tourId) throw new Error('tourId is required')

    const tourMember = await TourMember.create({
      memberId,
      tourId,
    })

    res.json(tourMember.display())
  } catch(e) {
    next(e)
  }
}

module.exports.update = async (req, res, next) => {
  try {
    const {
      memberId,
      tourId,
      status,
    } = req.body

    if (!memberId) throw new Error('memberId is required')
    if (!tourId) throw new Error('tourId is required')
    if (!status) throw new Error('status is required')

    const tourMember = await TourMember.findByPk(req.params.id)

    await tourMember.update({
      memberId,
      tourId,
      status,
    })

    res.json({ status: 'done' })
  } catch(e) {
    next(e)
  }
}

module.exports.destroy = async (req, res, next) => {
  try {
    const tourMember = await TourMember.findByPk(req.params.id)
    await tourMember.destroy()
    res.json({ status: 'done' })
  } catch (e) {
    next(e)
  }
}