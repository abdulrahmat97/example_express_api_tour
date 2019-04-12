'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Location', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    lat: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
  }).then(() => queryInterface.addIndex('Location', {
    fields: ['name']
  })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Location')
};
