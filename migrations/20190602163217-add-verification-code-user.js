'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.addColumn('User', 'verification_email_token', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
      await queryInterface.addColumn('User', 'verification_email_token_expiry', {
        type: Sequelize.DATE,
        allowNull: true,
      })
      await queryInterface.addIndex('User', {
        fields: ['verification_email_token'],
        type: 'UNIQUE',
      })
    }),
  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.removeColumn('User', 'verification_email_token')
      await queryInterface.removeColumn('User', 'verification_email_token_expiry')
    })
}
