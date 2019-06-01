const { ROLE } = require('../config/index')

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.addColumn('Session', 'role', {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ROLE.MEMBER
      })
    }),
  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.removeColumn('Session', 'role')
    })
}
