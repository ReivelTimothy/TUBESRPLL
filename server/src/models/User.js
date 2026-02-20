// server/src/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN', 'STAFF'), defaultValue: 'STAFF' },
    managerId: { type: DataTypes.UUID, allowNull: true },
    baseSalary: { type: DataTypes.FLOAT, defaultValue: 0 }
  });

  // server/src/models/User.js
  User.associate = (models) => {
    // Relasi User Tree
    User.belongsTo(models.User, { as: 'Manager', foreignKey: 'managerId' });
    User.hasMany(models.User, { as: 'Subordinates', foreignKey: 'managerId' });
    
    // Gunakan pengecekan if(models.NamaModel) agar tidak error jika file belum dibuat
    if (models.Attendance) User.hasMany(models.Attendance, { foreignKey: 'userId' });
    if (models.Penalty) User.hasMany(models.Penalty, { foreignKey: 'userId' });
    if (models.Leave) User.hasMany(models.Leave, { foreignKey: 'userId' });
    if (models.Reimburse) User.hasMany(models.Reimburse, { foreignKey: 'userId' });
    if (models.Payroll) User.hasMany(models.Payroll, { foreignKey: 'userId' });
  };

  return User;
};