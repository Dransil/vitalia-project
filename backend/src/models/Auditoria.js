const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Auditoria = sequelize.define('Auditoria', {
    id_auditoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: true },
    tabla_afectada: { type: DataTypes.STRING(50) },
    registro_id: { type: DataTypes.INTEGER },
    accion: { type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'ACCESO_DENEGADO') },
    datos_anteriores: { type: DataTypes.JSON },
    datos_nuevos: { type: DataTypes.JSON },
    ip_address: { type: DataTypes.STRING(45) },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'auditoria',
    timestamps: false
});

module.exports = Auditoria;