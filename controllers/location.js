
const { Location, Op } = require('../models')

module.exports.index = async (req, res, next) => {
    const result = await Location.findAndCountAll()
    res.json({
      list: result.rows.map(entity => entity.display()),
      total: result.count,
    })
}

module.exports.view =  async (req, res, next) => {
    const result = await Location.findOne({
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
      name,
      city,
      address,
      lat,
      lang,
     } = req.body

     if(!name) throw new Error('name field is required')
     if(!city) throw new Error('city field is required')
     if(!address) throw new Error('address field is required')

     const location = await Location.create({
      name,
      city,
      address,
      lat,
      lang,
    })

    res.json({
      result: location
    })
  } catch (e) {
    next(e)
  }

}

module.exports.update =  async (req, res, next) => {
  try {
    const { name, city, address, lat, lang } = req.body

    const location = await Location.findByPk(req.params.id)

    if(!location) throw new Error('location not found')
    await location.update({
      name, city, address, lat, lang
    })

    res.json(location.display())

  } catch (e) {
    next(e)
  }
}

module.exports.destroy = async (req, res, next) => {
  try {
    const location = await Location.findByPk(req.params.id)
    await location.destroy()
    res.json({ status: 'done' })
  } catch (e) {
    next(e)
  }
}