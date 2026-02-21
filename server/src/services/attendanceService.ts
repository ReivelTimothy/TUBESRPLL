export const createCheckIn = async (userId: string) => {
    const db = require('../models');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await db.Attendance.findOne({
        where: {
        userId,
        createdAt: {
            [db.Sequelize.Op.gte]: today
        }
        }
    });

    if (existingAttendance) {
        throw new Error('Anda sudah melakukan absensi hari ini.');
    }

    const now = new Date();
    const status = now.getHours() >= 9 ? 'LATE' : 'PRESENT';

    return await db.Attendance.create({
        userId,
        checkIn: now,
        status
  });
};