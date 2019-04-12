'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Like', {
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
  }).then(() => queryInterface.addIndex('Like', {
    fields: ['user_id','tour_id'],
    type: 'UNIQUE'
  })),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Like'),
};
