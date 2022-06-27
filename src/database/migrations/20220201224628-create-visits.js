'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.createTable('visits', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      came_at: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
      left_at: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
      brought: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      took: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      student_id: {
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
     */
    await queryInterface.dropTable('visits');
  },
};
