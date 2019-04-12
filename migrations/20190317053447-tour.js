'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Tour', {
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
    location_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'Location',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    title: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    max: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    date_start: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    date_end: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: ''
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
  }).then(() => queryInterface.addIndex('Tour', {
    fields: ['user_id','location_id'],
    type: 'UNIQUE'
  })),
  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Tour');
  }
};
