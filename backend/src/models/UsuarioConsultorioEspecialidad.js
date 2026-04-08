const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UsuarioConsultorioEspecialidad = sequelize.define('UsuarioConsultorioEspecialidad', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    id_consultorio: { type: DataTypes.INTEGER, allowNull: false },
    id_especialidad: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' },
    fecha_asignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'usuario_consultorio_especialidad',
    timestamps: false
});

module.exports = UsuarioConsultorioEspecialidad;