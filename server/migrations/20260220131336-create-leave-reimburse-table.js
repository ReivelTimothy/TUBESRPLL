'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Leaves', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' } },
      type: { type: Sequelize.STRING },
      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },
      status: { type: Sequelize.STRING, defaultValue: 'PENDING' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('Reimburses', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' } },
      amount: { type: Sequelize.FLOAT },
      description: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: 'PENDING' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Leaves');
    await queryInterface.dropTable('Reimburses');
  }
};
