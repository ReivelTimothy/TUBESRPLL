import { Router } from 'express';
import { createPenaltyController, deletePenaltyController, getPenaltiesController } from '../controllers/penaltyController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';

const penaltyRouter = Router();

penaltyRouter.use(authenticateJWT);

penaltyRouter.post('/', authorizeRole([UserRole.ADMIN, UserRole.MANAGER]), createPenaltyController);
penaltyRouter.get('/', 
    // authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), 
    getPenaltiesController);
penaltyRouter.delete('/:userId', authorizeRole([UserRole.ADMIN]), deletePenaltyController);

export default penaltyRouter;