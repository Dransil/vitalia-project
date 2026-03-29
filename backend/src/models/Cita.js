const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cita = sequelize.define('Cita', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Profesional que atiende'
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_tipo_cita: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duracion_minutos: {
    type: DataTypes.INTEGER
  },
  estado: {
    type: DataTypes.ENUM('programada', 'confirmada', 'en_espera', 'completada', 'cancelada', 'no_asistio'),
    defaultValue: 'programada'
  },
  notas_previa: {
    type: DataTypes.TEXT
  },
  razon_cancelacion: {
    type: DataTypes.TEXT
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_ultima_modificacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cita',
  timestamps: false
});

module.exports = Cita;