import { QueryInterface } from 'sequelize';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require('uuid');
// import { feedTypes, feeds } from './fixtures';
const plansTypes = [
  {
    id: uuidv4(),
    plan: 'Free',
    price: 0,
    currency_code: 'UAH',
    country_code: 'UA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    plan: 'Light',
    price: 200,
    currency_code: 'UAH',
    country_code: 'UA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    plan: 'Standard',
    price: 300,
    currency_code: 'UAH',
    country_code: 'UA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    plan: 'Premium',
    price: 500,
    currency_code: 'UAH',
    country_code: 'UA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const down = (queryInterface: QueryInterface): Promise<string | unknown> =>
  queryInterface.sequelize.transaction(async transaction => {
    return Promise.all([
      queryInterface.bulkDelete('plans', null, { transaction }),
    ]);
  });

const up = (queryInterface: QueryInterface): Promise<number | unknown> =>
  queryInterface.sequelize.transaction(async transaction => {
    // here go all migration changes
    return Promise.all([
      queryInterface.bulkInsert('plans', plansTypes, {
        transaction,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ignoreDuplicates: true,
      }),
    ]);
  });

export { down, up };

//
//
//
//
// 'use strict';
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { v4: uuidv4 } = require('uuid');
//
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface) {
//     await queryInterface.bulkInsert('plans', [
//       {
//         id: uuidv4(),
//         plan: 'Free',
//         price: 0,
//         currency_code: '',
//         country_code: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: uuidv4(),
//         plan: 'Light',
//         price: 200,
//         currency_code: 'UAH',
//         country_code: 'UA',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: uuidv4(),
//         plan: 'Standard',
//         price: 300,
//         currency_code: 'UAH',
//         country_code: 'UA',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: uuidv4(),
//         plan: 'Premium',
//         price: 500,
//         currency_code: 'UAH',
//         country_code: 'UA',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]);
//   },
//
//   async down(queryInterface) {
//     return queryInterface.bulkDelete('plans', null, {});
//   },
// };
