const { Member, Op } = require('../models')

module.exports.index = async (req, res, next) => {
  try {
    const result = await Member.findAndCountAll()

    res.json({
      list : result.rows.map((member) => member.display()),
      total: result.count
    })
  } catch(e) {
    next(e)
  }
}

module.exports.show = async (req, res, next) => {
  try {
    const member = await member.findByPk(req.params.id)

    res.json(member.display())
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

    const member = await Member.create({
      firstName,
      lastName,
      email,
      role,
      password,
    })

    res.json(member.display())
  } catch(e) {
    next(e)
  }
}

module.exports.update = async (req, res, next) => {
}

module.exports.destroy = async (req, res, next) => {
}