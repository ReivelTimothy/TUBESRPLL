// server/src/models/User.js
module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN', 'STAFF', 'MANAGER'), defaultValue: 'STAFF' },
    managerId: { type: DataTypes.UUID, allowNull: true, references: { model: 'Users', key: 'id' } },
    baseSalary: { type: DataTypes.FLOAT, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  User.associate = (models) => {
    
    User.belongsTo(models.User, { as: 'Manager', foreignKey: 'managerId' });
    User.hasMany(models.User, { as: 'Subordinates', foreignKey: 'managerId' });
    
    
    if (models.Attendance) User.hasMany(models.Attendance, { foreignKey: 'userId', as: 'Attendances' });
    if (models.Penalty) User.hasMany(models.Penalty, { foreignKey: 'userId', as: 'Penalties' });
    if (models.Leave) User.hasMany(models.Leave, { foreignKey: 'userId', as: 'Leaves' });
    if (models.Reimburse) User.hasMany(models.Reimburse, { foreignKey: 'userId', as: 'Reimburses' });
    if (models.Payroll) User.hasMany(models.Payroll, { foreignKey: 'userId', as: 'Payrolls' });
  };

  return User;
};