import { Router } from 'express';
import { triggerPayrollController, getPayrollController, updatePayrollController } from '../controllers/payrollController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';

const router = Router();

router.use(authenticateJWT);

// listing payrolls (role-filtered)
router.get('/', getPayrollController);

// manual trigger for payroll calculation (admin only)
router.post('/calculate', authorizeRole([UserRole.ADMIN]), triggerPayrollController);

// admin-only update
router.patch('/:id', authorizeRole([UserRole.ADMIN]), updatePayrollController);

export default router;
