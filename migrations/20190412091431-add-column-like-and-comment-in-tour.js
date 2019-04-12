'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.addColumn('Tour', 'like', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      })
      await queryInterface.addColumn('Tour', 'comment', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      })
    }),

  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.removeColumn('Tour', 'like')
      await queryInterface.removeColumn('Tour', 'comment')
    })
};
