'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.addColumn('User', 'verify_at', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    }),
  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.removeColumn('User', 'verify_at')
    })
}
