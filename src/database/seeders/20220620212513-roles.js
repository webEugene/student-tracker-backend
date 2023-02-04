'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('roles', [
      {
        id: Sequelize.UUID,
        value: 'admin',
        description: 'As Admin, you are allowed to manage all application',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.UUID,
        value: 'user',
        description:
          'As User you are allowed only see some pages and set time for pupils',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('roles', null, {});
  },
};
