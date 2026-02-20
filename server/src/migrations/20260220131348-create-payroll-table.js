'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payrolls', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' } },
      month: { type: Sequelize.INTEGER },
      year: { type: Sequelize.INTEGER },
      basicSalary: { type: Sequelize.FLOAT },
      allowances: { type: Sequelize.FLOAT }, // Total Bonus/Reimburse
      deductions: { type: Sequelize.FLOAT }, // Total Penalti/Potongan
      netSalary: { type: Sequelize.FLOAT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('Payrolls'); }
};