const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    cedula: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    telefono: { type: DataTypes.STRING(20) },
    id_especialidad: { type: DataTypes.INTEGER, allowNull: false },
    id_consultorio: { type: DataTypes.INTEGER, allowNull: false },
    contraseña_hash: { type: DataTypes.STRING(255), allowNull: false },
    horario_inicio: { type: DataTypes.TIME, allowNull: false },
    horario_fin: { type: DataTypes.TIME, allowNull: false },
    dias_atencion: { type: DataTypes.STRING(50) },
    rol: { type: DataTypes.ENUM('admin', 'dentista', 'medico'), defaultValue: 'dentista' },
    estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ultimo_acceso: { type: DataTypes.DATE }
}, {
    tableName: 'usuario',
    timestamps: false
});

module.exports = Usuario;