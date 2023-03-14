'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('plans', [
      {
        id: uuidv4(),
        plan: 'Free',
        price: 0,
        country_code: 'UAH',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        plan: 'Premium',
        price: 200.0,
        country_code: 'UAH',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('plans', null, {});
  },
};
