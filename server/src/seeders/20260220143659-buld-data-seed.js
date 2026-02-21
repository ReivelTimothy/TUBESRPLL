'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('password123', 10);
    
    // Simpan ID dalam variabel agar bisa digunakan sebagai Foreign Key di tabel lain
    const userIds = [uuidv4(), uuidv4(), uuidv4()];

    // 1. DATA USERS
    await queryInterface.bulkInsert('Users', [
      { id: userIds[0], name: 'Admin Utama', email: 'admin@hris.com', password, role: 'ADMIN', baseSalary: 10000000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[1], name: 'Budi Manager', email: 'budi@hris.com', password, role: 'STAFF', baseSalary: 8000000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[2], name: 'Siti Staff', email: 'siti@hris.com', password, role: 'STAFF', managerId : userIds[1] ,baseSalary: 5000000, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 2. DATA ATTENDANCES (Absensi)
    await queryInterface.bulkInsert('Attendances', [
      { id: uuidv4(), userId: userIds[0], checkIn: new Date(), status: 'PRESENT', createdAt: new Date(), updatedAt: new Date() },
     
    ]);

    // 3. DATA PENALTIES (Denda Barang Rusak/Terlambat)
    await queryInterface.bulkInsert('Penalties', [
      { id: uuidv4(), userId: userIds[2], type: 'DAMAGED_PROPERTY', amount: 150000, description: 'Layar laptop pecah', status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[1], type: 'DAMAGED_PROPERTY', amount: 50000, description: 'Mouse hilang', status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[2], type: 'LATE_PENALTY', amount: 10000, description: 'Terlambat lebih dari 15 menit', status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 4. DATA LEAVES (Cuti)
    await queryInterface.bulkInsert('Leaves', [
      { id: uuidv4(), userId: userIds[1], type: 'ANNUAL', startDate: new Date(), endDate: new Date(), status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[2], type: 'SICK', startDate: new Date(), endDate: new Date(), status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[0], type: 'ANNUAL', startDate: new Date(), endDate: new Date(), status: 'REJECTED', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Menghapus data dengan urutan terbalik untuk menghindari error Foreign Key
    await queryInterface.bulkDelete('Leaves', null, {});
    await queryInterface.bulkDelete('Penalties', null, {});
    await queryInterface.bulkDelete('Attendances', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};