'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Penalties', 'date', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.addColumn('Penalties', 'createdBy', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.sequelize.query('UPDATE "Penalties" SET "date" = COALESCE("date", "createdAt");');
    await queryInterface.sequelize.query('UPDATE "Penalties" SET "createdBy" = COALESCE("createdBy", "userId");');

    await queryInterface.changeColumn('Penalties', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Penalties', 'createdBy');
    await queryInterface.removeColumn('Penalties', 'date');
  },
};
