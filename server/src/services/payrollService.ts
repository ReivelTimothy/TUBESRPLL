import db from '../models';
import { Op } from 'sequelize';

const User = (db as any).User;
const Penalty = (db as any).Penalty;
const Attendance = (db as any).Attendance;
const Payroll = (db as any).Payroll;

function getMaxDeduction(basicSalary: number) {
  // Salary expressed in same units as DB (assume IDR as number)
  if (basicSalary < 5_000_000) return basicSalary * 0.2;
  if (basicSalary < 15_000_000) return basicSalary * 0.3;
  return basicSalary * 0.35;
}

export const calculatePayrollForPeriod = async (periodStart: Date, periodEnd: Date) => {
  // For every active user, compute penalties in period and create/update payroll record
  // Pull baseSalary from User (field is `baseSalary` on User model)
  const users = await User.findAll({ attributes: ['id', 'name', 'baseSalary', 'role', 'managerId'] });

  const results: any[] = [];

  for (const u of users) {
    const userId = u.id;
    const basicSalary = Number(u.baseSalary || 0);

    // Sum approved penalties in period
    const penaltySum = await Penalty.sum('amount', {
      where: {
        userId,
        status: 'APPROVED',
        date: { [Op.between]: [periodStart, periodEnd] }
      }
    }) || 0;

    // Attendance sync could go here (absent/late penalties) - omitted for brevity

    const maxDeduction = getMaxDeduction(basicSalary);
    const actualDeduction = Math.min(Number(penaltySum), maxDeduction);
    const penaltyArrears = Number(penaltySum) - actualDeduction > 0 ? Number(penaltySum) - actualDeduction : 0;

    // User model does not have allowances field by default; keep 0 unless present
    const allowances = Number((u as any).allowances || 0);
    const netSalary = basicSalary + allowances - actualDeduction;

    // Save payroll row for period (month/year derived from periodStart)
    const month = periodStart.getMonth() + 1;
    const year = periodStart.getFullYear();

    const [row, created] = await Payroll.findOrCreate({
      where: { userId, month, year },
      defaults: {
        userId,
        month,
        year,
        basicSalary,
        allowances,
        totalPenalties: penaltySum,
        cappedDeduction: maxDeduction,
        actualDeduction,
        penaltyArrears,
        netSalary,
        status: 'PENDING'
      }
    });

    // If row existed, update
    // If an existing record was found, update it with latest calculations
    if (!created && row) {
      await row.update({
        basicSalary,
        allowances,
        totalPenalties: penaltySum,
        cappedDeduction: maxDeduction,
        actualDeduction,
        penaltyArrears,
        netSalary
      });
    }

    results.push({ userId, basicSalary, allowances, totalPenalties: penaltySum, maxDeduction, actualDeduction, penaltyArrears, netSalary });
  }

  return results;
};

export const getPayrolls = async (requestingUser: any, filters?: { startDate?: Date; endDate?: Date }) => {
  const dateWhere: any = {};
  if (filters?.startDate && !Number.isNaN(filters.startDate.getTime())) {
    dateWhere[Op.gte] = filters.startDate;
  }
  if (filters?.endDate && !Number.isNaN(filters.endDate.getTime())) {
    dateWhere[Op.lte] = filters.endDate;
  }
  const whereDate = Object.keys(dateWhere).length > 0 ? { createdAt: dateWhere } : {};

  if (requestingUser.role === 'ADMIN') {
    return await Payroll.findAll({
      where: whereDate,
      include: [{ model: User, attributes: ['id', 'name', 'role', 'managerId'] }],
      order: [['createdAt', 'DESC']]
    });
  }

  // Manager: payrolls for their subordinates and themselves
  if (requestingUser.role === 'MANAGER') {
    const subordinates = await User.findAll({ where: { managerId: requestingUser.userId }, attributes: ['id'] });
    const ids = subordinates.map((s: any) => s.id).concat([requestingUser.userId]);
    return await Payroll.findAll({
      where: { userId: ids, ...whereDate },
      include: [{ model: User, attributes: ['id', 'name', 'role', 'managerId'] }],
      order: [['createdAt', 'DESC']]
    });
  }

  // Staff: only own payroll
  return await Payroll.findAll({
    where: { userId: requestingUser.userId, ...whereDate },
    include: [{ model: User, attributes: ['id', 'name', 'role', 'managerId'] }],
    order: [['createdAt', 'DESC']]
  });
};

export const updatePayroll = async (id: string, data: any) => {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) throw new Error('Payroll not found');
  await payroll.update(data);
  return payroll;
};
