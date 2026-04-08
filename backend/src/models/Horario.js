const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Horario = sequelize.define('Horario', {
    id_horario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    horario_inicio: { type: DataTypes.TIME, allowNull: false },
    horario_fin: { type: DataTypes.TIME, allowNull: false },
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'horario',
    timestamps: false
});

module.exports = Horario;