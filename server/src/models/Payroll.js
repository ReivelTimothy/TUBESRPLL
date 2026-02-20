// server/src/models/Payroll.js
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    month: { type: DataTypes.INTEGER },
    year: { type: DataTypes.INTEGER },
    basicSalary: { type: DataTypes.FLOAT },
    allowances: { type: DataTypes.FLOAT, defaultValue: 0 }, // Bonus/Reimburse
    deductions: { type: DataTypes.FLOAT, defaultValue: 0 }, // Penalti
    netSalary: { type: DataTypes.FLOAT } // Hasil akhir
  });

  Payroll.associate = (models) => {
    Payroll.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Payroll;
};