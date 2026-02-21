import { Request, Response } from 'express';
import { controllerWrapper } from '../utils/controllerWrapper';
import { createCheckIn } from '../services/attendanceService';

export const checkIn = controllerWrapper(async (req: Request, res: Response) => {
    
    // Nantinya userId diambil dari JWT Token (req.user.id)
    // Untuk tes sekarang, kita ambil dari body dulu
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID dibutuhkan' });
    }

    const attendance = await createCheckIn(userId);
    res.status(201).json({
    message: 'Absensi berhasil!',
    data: attendance
    });
});

