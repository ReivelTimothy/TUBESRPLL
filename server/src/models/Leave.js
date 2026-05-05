module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    remarks: { type: DataTypes.TEXT, allowNull: true },
    processedBy: { type: DataTypes.UUID, allowNull: true },
    status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' }
  });

  Leave.associate = (models) => {
    Leave.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    Leave.belongsTo(models.User, { foreignKey: 'processedBy', as: 'Processor' });
  };

  return Leave;
};