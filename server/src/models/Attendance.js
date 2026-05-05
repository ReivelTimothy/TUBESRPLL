module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    checkIn: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    checkOut: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false }
  }, { timestamps: true, tableName: 'Attendances' });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Attendance;
};