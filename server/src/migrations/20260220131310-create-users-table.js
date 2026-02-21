'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('ADMIN', 'STAFF'), defaultValue: 'STAFF' },
      managerId: { type: Sequelize.UUID, allowNull: true, references: { model: 'Users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      baseSalary: { type: Sequelize.FLOAT, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('Users', { cascade: true }); }
};