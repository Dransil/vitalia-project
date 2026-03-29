const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoCita = sequelize.define('TipoCita', {
  id_tipo_cita: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  duracion_promedio: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    comment: 'en minutos' 
  },
  costo_base: { type: DataTypes.DECIMAL(10, 2) },
  requiere_diagnostico: { type: DataTypes.BOOLEAN, defaultValue: true },
  requiere_procedimiento: { type: DataTypes.BOOLEAN, defaultValue: false },
  estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'tipo_cita',
  timestamps: false
});

module.exports = TipoCita;