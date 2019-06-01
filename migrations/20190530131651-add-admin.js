'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Admin', {
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
    name: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    locale: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'id',
    },
    phone_number: {
      type: Sequelize.TEXT,
      allowNull: true,
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
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }).then(() => queryInterface.addIndex('Admin', {
    fields: ['user_id'],
    type: 'UNIQUE'
  })),
  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Admin')
  }
}
