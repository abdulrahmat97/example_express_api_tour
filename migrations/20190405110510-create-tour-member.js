'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('TourMember', {
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
    member_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  }).then(() => queryInterface.addIndex('TourMember', {
    fields: ['member_id','tour_id'],
    type: 'UNIQUE'
  })),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('TourMember'),
};
