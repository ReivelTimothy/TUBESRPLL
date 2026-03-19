'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('ADMIN', 'STAFF'), defaultValue: 'STAFF' },
      credentialId: { type: Sequelize.TEXT, allowNull: true, unique: true },
      publicKey: { type: Sequelize.TEXT, allowNull: true },
      counter: { type: Sequelize.INTEGER, defaultValue: 0 },
      deviceId: { type: Sequelize.STRING, allowNull: true, unique: true },
      registeredIp: { type: Sequelize.STRING, allowNull: true },
      managerId: { type: Sequelize.UUID, allowNull: true, references: { model: 'Users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      baseSalary: { type: Sequelize.FLOAT, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users', { cascade: true });
  }
};