// server/src/models/Leave.js
module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' }
  });
  return Leave;
};

// server/src/models/Reimburse.js
module.exports = (sequelize, DataTypes) => {
  const Reimburse = sequelize.define('Reimburse', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.FLOAT },
    description: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' }
  });
  return Reimburse;
};