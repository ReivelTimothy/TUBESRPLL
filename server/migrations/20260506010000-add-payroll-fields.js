'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Payrolls', 'totalPenalties', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Payrolls', 'cappedDeduction', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Payrolls', 'actualDeduction', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Payrolls', 'penaltyArrears', { type: Sequelize.FLOAT, defaultValue: 0 });
    await queryInterface.addColumn('Payrolls', 'status', { type: Sequelize.ENUM('PENDING','READY','DISTRIBUTED'), defaultValue: 'PENDING' });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Payrolls', 'totalPenalties');
    await queryInterface.removeColumn('Payrolls', 'cappedDeduction');
    await queryInterface.removeColumn('Payrolls', 'actualDeduction');
    await queryInterface.removeColumn('Payrolls', 'penaltyArrears');
    await queryInterface.removeColumn('Payrolls', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Payrolls_status";');
  }
};
