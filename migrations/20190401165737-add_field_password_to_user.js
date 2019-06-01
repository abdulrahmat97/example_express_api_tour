'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.addColumn('User', 'password', {
        type: Sequelize.TEXT,
        defaultValue: '',
      })
      await queryInterface.addColumn('User', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    }),

  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.removeColumn('User', 'password')
      await queryInterface.removeColumn('User', 'reset_password_token')
      await queryInterface.removeColumn('User', 'deleted_at')
    })
};
