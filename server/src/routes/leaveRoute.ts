import { Router } from 'express';
import {
  getCalendarController,
  getLeaveRequestsController,
  processLeaveController,
  requestLeaveController,
} from '../controllers/leaveController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';

const leaveRouter = Router();

leaveRouter.use(authenticateJWT);

leaveRouter.post('/', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), requestLeaveController);
leaveRouter.get('/', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), getLeaveRequestsController);
leaveRouter.get('/calendar', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), getCalendarController);
leaveRouter.patch('/:id/process', authorizeRole([UserRole.ADMIN, UserRole.MANAGER]), processLeaveController);

export default leaveRouter;