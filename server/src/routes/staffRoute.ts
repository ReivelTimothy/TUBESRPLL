import { Router } from 'express';
import { getEligibleStaffController } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';

const staffRouter = Router();

staffRouter.use(authenticateJWT);
staffRouter.get('/eligible', authorizeRole([UserRole.ADMIN, UserRole.MANAGER]), getEligibleStaffController);

export default staffRouter;
