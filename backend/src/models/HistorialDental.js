const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HistorialDental = sequelize.define('HistorialDental', {
  id_historial_dental: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_historial: { type: DataTypes.INTEGER, allowNull: false },
  numero_diente: { 
    type: DataTypes.INTEGER, 
    comment: '1-32 (notación FDI)' 
  },
  estado_inicial: { type: DataTypes.STRING(50) },
  estado_final: { type: DataTypes.STRING(50) },
  tratamiento_aplicado: { type: DataTypes.STRING(100) },
  url_foto_antes: { type: DataTypes.TEXT },
  url_foto_despues: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'historial_dental',
  timestamps: false
});

module.exports = HistorialDental;