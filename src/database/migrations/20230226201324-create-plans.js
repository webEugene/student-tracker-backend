'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plans', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      plan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plans');
  },
};
