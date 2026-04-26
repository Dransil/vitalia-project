const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Diente = sequelize.define('Diente', {
    id_diente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero_fdi: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    cuadrante: {
        type: DataTypes.ENUM('superior_derecho','superior_izquierdo','inferior_izquierdo','inferior_derecho'),
        allowNull: false
    },
    es_muela_juicio: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'diente',
    timestamps: false
});

module.exports = Diente;