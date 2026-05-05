import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';
import { getDailyQrController, scanAttendanceController, getAttendancesController } from '../controllers/attendanceController';

const attendanceRoute = Router();

attendanceRoute.use(authenticateJWT);
attendanceRoute.get('/', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), getAttendancesController);
attendanceRoute.get('/qr/daily', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), getDailyQrController);
attendanceRoute.post('/scan', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), scanAttendanceController);

export default attendanceRoute;
