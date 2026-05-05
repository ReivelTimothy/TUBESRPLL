'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('password123', 10);
    
    // Simpan ID dalam variabel agar bisa digunakan sebagai Foreign Key di tabel lain
    const userIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

    // 1. DATA USERS
    await queryInterface.bulkInsert('Users', [
      { id: userIds[0], name: 'Admin Utama', email: 'admin@hris.com', password, role: 'ADMIN', baseSalary: 15000000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[1], name: 'Budi Manager', email: 'budi@hris.com', password, role: 'MANAGER', managerId: userIds[0], baseSalary: 12000000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[2], name: 'Rina Manager', email: 'rina@hris.com', password, role: 'MANAGER', managerId: userIds[0], baseSalary: 11500000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[3], name: 'Siti Staff', email: 'siti@hris.com', password, role: 'STAFF', managerId: userIds[1], baseSalary: 6000000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[4], name: 'Andi Staff', email: 'andi@hris.com', password, role: 'STAFF', managerId: userIds[1], baseSalary: 5800000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[5], name: 'Maya Staff', email: 'maya@hris.com', password, role: 'STAFF', managerId: userIds[2], baseSalary: 6200000, createdAt: new Date(), updatedAt: new Date() },
      { id: userIds[6], name: 'Rudi Staff', email: 'rudi@hris.com', password, role: 'STAFF', managerId: userIds[2], baseSalary: 5900000, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 2. DATA ATTENDANCES (Absensi)
    // await queryInterface.bulkInsert('Attendances', [
    //   { id: uuidv4(), userId: userIds[0], checkIn: new Date(), status: 'PRESENT', createdAt: new Date(), updatedAt: new Date() },
     
    // ]);

    // 3. DATA PENALTIES (Denda Barang Rusak/Terlambat)
    await queryInterface.bulkInsert('Penalties', [
      { id: uuidv4(), userId: userIds[3], type: 'DAMAGE', amount: 150000, description: 'Layar laptop pecah', date: new Date('2026-05-03'), createdBy: userIds[1], status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[4], type: 'DAMAGE', amount: 50000, description: 'Mouse hilang', date: new Date('2026-05-01'), createdBy: userIds[1], status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[5], type: 'LATE', amount: 10000, description: 'Terlambat lebih dari 15 menit', date: new Date('2026-05-02'), createdBy: userIds[2], status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 4. DATA LEAVES (Cuti)
    await queryInterface.bulkInsert('Leaves', [
      { id: uuidv4(), userId: userIds[3], type: 'PAID', startDate: new Date('2026-05-12'), endDate: new Date('2026-05-14'), reason: 'Keluarga di luar kota', remarks: 'Disetujui untuk cuti tahunan', processedBy: userIds[1], status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[4], type: null, startDate: new Date('2026-05-20'), endDate: new Date('2026-05-21'), reason: 'Kondisi kesehatan', remarks: null, processedBy: null, status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[5], type: 'UNPAID', startDate: new Date('2026-05-18'), endDate: new Date('2026-05-19'), reason: 'Perlu urus keluarga', remarks: 'Disetujui sebagai unpaid leave', processedBy: userIds[2], status: 'APPROVED', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[6], type: null, startDate: new Date('2026-05-22'), endDate: new Date('2026-05-22'), reason: 'Urusan pribadi mendadak', remarks: 'Menunggu review manager', processedBy: null, status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), userId: userIds[1], type: 'PAID', startDate: new Date('2026-05-25'), endDate: new Date('2026-05-26'), reason: 'Cuti singkat', remarks: 'Ditolak karena beban kerja tinggi', processedBy: userIds[0], status: 'REJECTED', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Leaves', null, {});
    await queryInterface.bulkDelete('Penalties', null, {});
    await queryInterface.bulkDelete('Attendances', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};