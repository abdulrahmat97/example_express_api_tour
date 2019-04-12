'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
  .then(async () => {
    await queryInterface.changeColumn('Tour', 'title', {
      type: Sequelize.STRING,
    })
  }),

  down: (queryInterface, Sequelize) => Promise.resolve()
  .then(async () => {
    await queryInterface.changeColumn('Tour', 'title', {
      type: Sequelize.INTEGER,
    })
  }),
};
