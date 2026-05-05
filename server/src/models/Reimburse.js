module.exports = (sequelize, DataTypes) => {
  const Reimburse = sequelize.define('Reimburse', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.FLOAT },
    description: { type: DataTypes.STRING },
    attachmentUrl: { type: DataTypes.STRING, allowNull: true },
    processedBy: { type: DataTypes.UUID, allowNull: true },
    status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' }
  });

  Reimburse.associate = (models) => {
    Reimburse.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    Reimburse.belongsTo(models.User, { foreignKey: 'processedBy', as: 'Processor' });
  };

  return Reimburse;
};