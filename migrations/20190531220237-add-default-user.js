const { ROLE } = require('../config/index')
module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(async() => {
      await queryInterface.bulkInsert('User', [{
        id: 1,
        email: 'user@user.com',
        username: 'user',
        password: Sequelize.fn('crypt', 'user', Sequelize.fn('gen_salt', 'SHA2')),
        reset_password_token: '',
        status: true,
        role: ROLE.MEMBER,
        created_at: new Date(),
        updated_at: new Date(),
      }])
      await queryInterface.bulkInsert('Member', [{
        id: 1,
        user_id: 1,
        name: 'user',
        phone_number: '08222333',
        city: '',
        address: '',
        created_at: new Date(),
        updated_at: new Date(),
      }])
    }),

  down: queryInterface => Promise.resolve()
    .then(async() => {
      await queryInterface.bulkDelete('User', { id: 1 })
      await queryInterface.bulkDelete('Member', { id: 1 })
    })
}
