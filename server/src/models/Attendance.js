// server/src/models/Attendance.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    checkIn: { type: DataTypes.DATE },
    checkOut: { type: DataTypes.DATE },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    status: { type: DataTypes.STRING } // e.g., 'PRESENT', 'LATE'
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Attendance;
};