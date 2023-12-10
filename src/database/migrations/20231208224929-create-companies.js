'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tariff_start_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      tariff_end_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      tariff_permission: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      plan_id: {
        type: Sequelize.UUID,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('companies');
  },
};
