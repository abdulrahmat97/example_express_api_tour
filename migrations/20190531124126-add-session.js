'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Session', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    expiry: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'active',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
  }).then(async () => {
    queryInterface.addIndex('Session', {
      fields: ['user_id'],
      type: 'UNIQUE'
    })
    queryInterface.addIndex('Session', {
      fields: ['token'],
      type: 'UNIQUE'
    })
  }),
  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Session')
  }
}
