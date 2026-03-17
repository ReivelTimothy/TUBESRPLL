'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Penalties', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' } },
      type: { type: Sequelize.STRING }, // DAMAGED_PROPERTY, DISCIPLINE
      amount: { type: Sequelize.FLOAT },
      description: { type: Sequelize.TEXT },
      attachment: { type: Sequelize.STRING }, // URL Foto Barang Rusak
      status: { type: Sequelize.STRING, defaultValue: 'PENDING' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('Penalties'); }
};