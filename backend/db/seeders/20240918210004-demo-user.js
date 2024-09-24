'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, [
      {
          email: 'demo@user.io',
          username: 'Demo-lition',
          firstName: 'Demo',
          lastName: 'User',
          hashedPassword: bcrypt.hashSync('password'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@user.io',
          username: 'FakeUser1',
          firstName: 'Fake',
          lastName: 'User1',
          hashedPassword: bcrypt.hashSync('password2'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@user.io',
          username: 'FakeUser2',
          firstName: 'Fake',
          lastName: 'User2',
          hashedPassword: bcrypt.hashSync('password3'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
  },

  async down (queryInterface, Sequelize) {
      options.tableName = 'Users';
      await queryInterface.bulkDelete(options, null, {});
  }
};
