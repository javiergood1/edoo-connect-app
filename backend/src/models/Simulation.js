const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Simulation = sequelize.define('Simulation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  wizard_data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  report_data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'in_progress',
    validate: {
      isIn: [['in_progress', 'completed', 'cancelled']],
    },
  },
}, {
  tableName: 'simulations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Simulation;
