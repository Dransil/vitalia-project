const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Paciente = sequelize.define('Paciente', {
    id_paciente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    cedula: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false},
    email: { type: DataTypes.STRING(100) },
    telefono: { type: DataTypes.STRING(20) },
    direccion: { type: DataTypes.STRING(255) },
    ciudad: { type: DataTypes.STRING(100) },
    alergias: { type: DataTypes.TEXT },
    condiciones_medicas: { type: DataTypes.TEXT },
    medicamentos_actuales: { type: DataTypes.TEXT },
    grupo_sanguineo: { type: DataTypes.STRING(5) },
    contacto_emergencia_nombre: { type: DataTypes.STRING(100) },
    contacto_emergencia_telefono: { type: DataTypes.STRING(20) },
    contacto_emergencia_relacion: { type: DataTypes.STRING(50) },
    seguro_medico: { type: DataTypes.STRING(100) },
    numero_poliza: { type: DataTypes.STRING(50) },
    estado: { type: DataTypes.ENUM('activo', 'inactivo', 'archivado'), defaultValue: 'activo' },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    registrado_por: { type: DataTypes.INTEGER }
}, {
    tableName: 'paciente',
    timestamps: false
});

module.exports = Paciente;