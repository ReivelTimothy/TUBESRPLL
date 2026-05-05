'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Leaves', 'remarks', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.changeColumn('Leaves', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.changeColumn('Leaves', 'startDate', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('Leaves', 'endDate', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('Leaves', 'reason', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Leaves', 'remarks');

    await queryInterface.changeColumn('Leaves', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'PENDING'
    });
  }
};