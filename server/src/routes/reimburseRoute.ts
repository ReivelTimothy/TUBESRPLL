import { Router } from 'express';
import { getReimburses, processReimburse, requestReimburse } from '../controllers/reimburseController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { uploadReimburseReceipt } from '../middleware/reimburseUpload';
import { UserRole } from '../types/enum';

const reimburseRouter = Router();

reimburseRouter.use(authenticateJWT);

reimburseRouter.post(
    '/',
    authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]),
    uploadReimburseReceipt,
    requestReimburse
);
reimburseRouter.get('/', 
    // authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), 
    getReimburses);
reimburseRouter.patch('/:id/process', authorizeRole([UserRole.ADMIN, UserRole.MANAGER]), processReimburse);

export default reimburseRouter;