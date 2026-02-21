import { Router } from 'express';
import { checkIn } from '../controllers/attendanceController';


const router = Router();

router.post('/check-in', checkIn);

export default router;