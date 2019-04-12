'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.removeIndex('Tour', 'tour_user_id_location_id')
      await queryInterface.addIndex('Tour', ['user_id']),
      await queryInterface.addIndex('Tour', ['location_id'])
    }),

  down: (queryInterface, Sequelize) => Promise.resolve()
    .then(async () => {
      await queryInterface.addIndex('Tour', {
        fields: ['user_id','location_id'],
        type: 'UNIQUE'
      })
    })
};
