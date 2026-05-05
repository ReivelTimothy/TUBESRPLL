import * as payrollService from '../services/payrollService';
import { controllerWrapper } from '../utils/controllerWrapper';
import { TokenPayloadRequest } from '../types/auth';

export const triggerPayrollController = controllerWrapper(async (req: any) => {
  const { start, end } = req.body;
  const startDate = start ? new Date(start) : new Date();
  const endDate = end ? new Date(end) : new Date();
  const result = await payrollService.calculatePayrollForPeriod(startDate, endDate);
  return { result };
});

export const getPayrollController = controllerWrapper(async (req: TokenPayloadRequest) => {
  const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
  const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;
  const result = await payrollService.getPayrolls(req.user, { startDate, endDate });
  return { result };
});

export const updatePayrollController = controllerWrapper(async (req: any) => {
  const { id } = req.params;
  const data = req.body;
  const result = await payrollService.updatePayroll(id, data);
  return { result };
});
