const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  id_cita: { type: DataTypes.INTEGER, allowNull: false },
  tipo: { 
    type: DataTypes.ENUM('email', 'sms', 'en_sistema'), 
    defaultValue: 'en_sistema' 
  },
  evento: { 
    type: DataTypes.ENUM('cita_creada', 'recordatorio_24h', 'recordatorio_1h', 'cita_modificada', 'cita_cancelada') 
  },
  titulo: { type: DataTypes.STRING(200) },
  mensaje: { type: DataTypes.TEXT },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'enviada', 'leida', 'fallida'), 
    defaultValue: 'pendiente' 
  },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_envio: { type: DataTypes.DATE },
  fecha_lectura: { type: DataTypes.DATE },
  intento_numero: { type: DataTypes.INTEGER, defaultValue: 1 },
  motivo_error: { type: DataTypes.TEXT }
}, {
  tableName: 'notificacion',
  timestamps: false
});

module.exports = Notificacion;