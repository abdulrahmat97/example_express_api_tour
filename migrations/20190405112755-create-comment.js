'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comment', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tour_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'Tour',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '',
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
  }).then(() => queryInterface.addIndex('Comment', {
    fields: ['user_id','tour_id'],
    type: 'UNIQUE'
  })),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Comment'),
};
