'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('plans', [
      {
        id: uuidv4(),
        plan: 0,
        price: 0,
        currency_code: 'UAH',
        country_code: 'UA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        plan: 1,
        price: 20000,
        currency_code: 'UAH',
        country_code: 'UA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        plan: 2,
        price: 30000,
        currency_code: 'UAH',
        country_code: 'UA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        plan: 3,
        price: 50000,
        currency_code: 'UAH',
        country_code: 'UA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('plans', null, {});
  },
};
