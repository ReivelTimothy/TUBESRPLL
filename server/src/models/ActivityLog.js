// server/src/models/ActivityLog.js
module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID },
    action: { type: DataTypes.STRING },
    details: { type: DataTypes.JSONB }
  });
  return ActivityLog;
};