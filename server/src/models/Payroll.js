// server/src/models/Payroll.js
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    month: { type: DataTypes.INTEGER },
    year: { type: DataTypes.INTEGER },
    basicSalary: { type: DataTypes.FLOAT },
    allowances: { type: DataTypes.FLOAT, defaultValue: 0 }, // Bonus/Reimburse
    totalPenalties: { type: DataTypes.FLOAT, defaultValue: 0 },
    cappedDeduction: { type: DataTypes.FLOAT, defaultValue: 0 },
    actualDeduction: { type: DataTypes.FLOAT, defaultValue: 0 },
    penaltyArrears: { type: DataTypes.FLOAT, defaultValue: 0 },
    netSalary: { type: DataTypes.FLOAT }, // Hasil akhir
    status: { type: DataTypes.ENUM('PENDING','READY','DISTRIBUTED'), defaultValue: 'PENDING' }
  });

  Payroll.associate = (models) => {
    Payroll.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Payroll;
};