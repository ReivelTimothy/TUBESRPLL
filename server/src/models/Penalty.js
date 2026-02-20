// server/src/models/Penalty.js
module.exports = (sequelize, DataTypes) => {
  const Penalty = sequelize.define('Penalty', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING }, // e.g., 'DAMAGED_PROPERTY'
    amount: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT },
    attachment: { type: DataTypes.STRING }, // URL Foto bukti rusak
    status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' }
  });

  Penalty.associate = (models) => {
    Penalty.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Penalty;
};