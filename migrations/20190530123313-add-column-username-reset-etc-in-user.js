'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.addColumn('User', 'username', {
        type: Sequelize.TEXT,
        defaultValue: '',
        allowNull: false,
      })
      await queryInterface.addColumn('User', 'reset_password_token', {
        type: Sequelize.TEXT,
        defaultValue: '',
        allowNull: false,
      })
      await queryInterface.addColumn('User', 'reset_password_expiry', {
        type: Sequelize.DATE,
        allowNull: true,
      })
      await queryInterface.addColumn('User', 'last_login', {
        type: Sequelize.DATE,
        allowNull: true,
      })
      await queryInterface.addColumn('User', 'status', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      await queryInterface.removeColumn('User', 'first_name')
      await queryInterface.removeColumn('User', 'last_name')
      await queryInterface.addIndex('User', {
        fields: ['username', 'email'],
        type: 'UNIQUE',
      })
    }),
  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.removeColumn('User', 'username')
      await queryInterface.removeColumn('User', 'reset_password_token')
      await queryInterface.removeColumn('User', 'reset_password_expiry')
      await queryInterface.removeColumn('User', 'status')
      await queryInterface.removeIndex('User', 'user_email')
      await queryInterface.removeIndex('User', 'user_username_email_role')
    })
}
