import cron from 'node-cron';
import * as payrollService from '../services/payrollService';

// Run every Sunday at 02:00 (server time) to aggregate week payrolls
export const schedulePayrollJobs = () => {
  cron.schedule('0 2 * * 0', async () => {
    try {
      // Calculate for the last week (past 7 days)
      const now = new Date();
      const lastSunday = new Date(now);
      lastSunday.setDate(now.getDate() - ((now.getDay() + 7 - 0) % 7));
      lastSunday.setHours(0,0,0,0);
      const lastSaturday = new Date(lastSunday);
      lastSaturday.setDate(lastSunday.getDate() + 6);
      lastSaturday.setHours(23,59,59,999);

      await payrollService.calculatePayrollForPeriod(lastSunday, lastSaturday);
      // Optionally mark payrolls READY on Monday - another cron could run
    } catch (err) {
      console.error('Payroll cron failed', err);
    }
  });

  // Monday 02:05 - mark PENDING payrolls to READY so employees can view
  cron.schedule('5 2 * * 1', async () => {
    try {
      const db = require('../models').default || require('../models');
      const Payroll = (db as any).Payroll;
      await Payroll.update({ status: 'READY' }, { where: { status: 'PENDING' } });
      console.log('Payrolls marked READY');
    } catch (err) {
      console.error('Failed to mark payrolls READY', err);
    }
  });
};
