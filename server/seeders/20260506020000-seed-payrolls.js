'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all users
    const users = await queryInterface.sequelize.query(`SELECT id, "baseSalary" FROM "Users";`, { 
      type: queryInterface.sequelize.QueryTypes.SELECT 
    });

    // Get current month/year for seeding
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Calculate period bounds for querying penalties
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0, 23, 59, 59);

    // Prevent duplicate rows for same payroll period
    await queryInterface.bulkDelete('Payrolls', { month, year }, {});

    // Salary bracket capping logic (matches payrollService)
    const getMaxDeduction = (basicSalary) => {
      if (basicSalary < 5_000_000) return basicSalary * 0.2;
      if (basicSalary < 15_000_000) return basicSalary * 0.3;
      return basicSalary * 0.35;
    };

    const rows = [];

    // Calculate payroll for each user using real penalty data
    for (const u of users) {
      const basicSalary = parseFloat(u.baseSalary) || 0;

      // Query for approved penalties in the current period
      const [penaltyResult] = await queryInterface.sequelize.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM "Penalties" 
         WHERE "userId" = :userId AND status = 'APPROVED' 
         AND date >= :periodStart AND date <= :periodEnd;`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          replacements: {
            userId: u.id,
            periodStart,
            periodEnd
          }
        }
      );

      // Use real penalty sum or default to 0
      const totalPenalties = penaltyResult ? parseFloat(penaltyResult.total) || 0 : 0;
      const maxDeduction = getMaxDeduction(basicSalary);
      const actualDeduction = Math.min(totalPenalties, maxDeduction);
      const penaltyArrears = totalPenalties > maxDeduction ? totalPenalties - maxDeduction : 0;
      const allowances = 0;
      const netSalary = basicSalary + allowances - actualDeduction;

      rows.push({
        id: Sequelize.literal('gen_random_uuid()'),
        "userId": u.id,
        month,
        year,
        "basicSalary": basicSalary,
        "allowances": allowances,
        "totalPenalties": totalPenalties,
        "cappedDeduction": maxDeduction,
        "actualDeduction": actualDeduction,
        "penaltyArrears": penaltyArrears,
        "netSalary": netSalary,
        status: 'PENDING',
        "createdAt": new Date(),
        "updatedAt": new Date()
      });
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('Payrolls', rows);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Payrolls', null, {});
  }
};
