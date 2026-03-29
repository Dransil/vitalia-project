const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Especialidad = sequelize.define('Especialidad', {
  id_especialidad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  estado: { type: DataTypes.ENUM('activa', 'inactiva'), defaultValue: 'activa' },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'especialidad',
  timestamps: false
});

module.exports = Especialidad;