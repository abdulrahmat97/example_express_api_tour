const { User, Op } = require('../models')

module.exports.index = async (req, res, next) => {
  try {
    const result = await User.findAndCountAll()

    res.json({
      list : result.rows.map((user) => user.display()),
      total: result.count
    })
  } catch(e) {
    next(e)
  }
}

module.exports.show = async (req, res, next) => {
  try {
    const user = await user.findByPk(req.params.id)

    res.json(user.display())
  } catch(e) {
    next(e)
  }
}

module.exports.store = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      password,
    } = req.body

    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password,
    })

    res.json(user.display())
  } catch(e) {
    next(e)
  }
}

module.exports.update = async (req, res, next) => {
}

module.exports.destroy = async (req, res, next) => {
}