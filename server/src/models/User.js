// server/src/models/User.js
module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN', 'STAFF'), defaultValue: 'STAFF' },
    // Kolom WebAuthn & Security
    credentialId: { type: DataTypes.TEXT, allowNull: true, unique: true },
    publicKey: { type: DataTypes.TEXT, allowNull: true },
    counter: { type: DataTypes.INTEGER, defaultValue: 0 },
    deviceId: { type: DataTypes.STRING, allowNull: true, unique: true },
    registeredIp: { type: DataTypes.STRING, allowNull: true },
    // Kolom Struktur & Payroll
    managerId: { type: DataTypes.UUID, allowNull: true },
    baseSalary: { type: DataTypes.FLOAT, defaultValue: 0 }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  User.associate = (models) => {
    // Relasi User Tree (Self-referencing)
    User.belongsTo(models.User, { as: 'Manager', foreignKey: 'managerId' });
    User.hasMany(models.User, { as: 'Subordinates', foreignKey: 'managerId' });
    
    // Relasi Modul HCRM (dengan alias 'as' agar query lebih mudah)
    if (models.Attendance) User.hasMany(models.Attendance, { foreignKey: 'userId', as: 'Attendances' });
    if (models.Penalty) User.hasMany(models.Penalty, { foreignKey: 'userId', as: 'Penalties' });
    if (models.Leave) User.hasMany(models.Leave, { foreignKey: 'userId', as: 'Leaves' });
    if (models.Reimburse) User.hasMany(models.Reimburse, { foreignKey: 'userId', as: 'Reimburses' });
    if (models.Payroll) User.hasMany(models.Payroll, { foreignKey: 'userId', as: 'Payrolls' });
  };

  return User;
};