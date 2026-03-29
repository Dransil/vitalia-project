const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultorio = sequelize.define('Consultorio', {
  id_consultorio: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(150), allowNull: false },
  direccion: { type: DataTypes.STRING(255) },
  ciudad: { type: DataTypes.STRING(100) },
  telefono: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100) },
  horario_apertura: { type: DataTypes.TIME },
  horario_cierre: { type: DataTypes.TIME },
  dias_atencion: { type: DataTypes.STRING(50) },
  estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'consultorio',
  timestamps: false
});

module.exports = Consultorio;