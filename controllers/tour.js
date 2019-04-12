const { Tour, User, Location, Op } = require('../models')

module.exports.index = async (req, res, next) => {
  try {
    // kita juga bisa hanya dengan mengugnkana await Tour.findAndCountAll() *tanpa parameter*
    // jika tidak ingin melakukan perubahan
    const result = await Tour.findAndCountAll({include: [
      {
        model: Location,
        as: 'location',
        attributes: {
          // exclude akan menyembunyikan field yang tidak dibutuhkan
          exclude: ['deletedAt', 'createdAt', 'updatedAt']
        }
      },
      {
        model: User,
        as: 'user',
        // untuk menampilkan field tertentu
        attributes: [
          'firstName',
          'lastName',
          'email']
      },
    ]})

    res.json({
      list: result.rows.map(entity => entity.display()),
      total: result.count
    })

  } catch(e) {
    next(e)
  }
}

module.exports.show = async (req, res, next) => {
  try {
    const tour = await Tour.findByPk(req.params.id)
    if(!tour) throw new Error('tour not found')
    res.json(Tour.display())
  } catch(e) {
    next(e)
  }
}

module.exports.store = async (req, res, next) => {
  try {
    const {
      userId,
      locationId,
      title,
      max,
      dateStart,
      dateEnd,
      description
     } = req.body

     if(!userId) throw new Error('userId is required')
     if(!locationId) throw new Error('locationId is required')
     if(!title) throw new Error('title is required')
     if(!max) throw new Error('max is required')
     if(!dateStart) throw new Error('dateStart is required')
     if(!dateEnd) throw new Error('dateEnd is required')
     if(!description) throw new Error('description is required')

     const tour = await Tour.create({
      userId,
      locationId,
      title,
      max,
      dateStart,
      dateEnd,
      description
     })

     res.json(tour.display())

  } catch(e) {
    next(e)
  }
}