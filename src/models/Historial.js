const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Historial = sequelize.define('Historial', {
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: 'Relación 1:1 con cita'
  },
  diagnostico: {
    type: DataTypes.TEXT
  },
  procedimientos_realizados: {
    type: DataTypes.JSON, // Sequelize mapea LONGTEXT con JSON automáticamente
    comment: 'Detalles en formato JSON'
  },
  medicamentos_prescritos: {
    type: DataTypes.JSON,
    comment: 'Medicamentos en formato JSON'
  },
  observaciones_clinicas: {
    type: DataTypes.TEXT
  },
  recomendaciones: {
    type: DataTypes.TEXT
  },
  requiere_seguimiento: {
    type: DataTypes.BOOLEAN, // tinyint(1) se mapea como BOOLEAN en Sequelize
    defaultValue: false
  },
  fecha_proximo_control: {
    type: DataTypes.DATEONLY
  },
  registrado_por: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_ultima_edicion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  editado_por: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'historial',
  timestamps: false // Evitamos duplicidad con fecha_creacion y fecha_ultima_edicion
});

module.exports = Historial;