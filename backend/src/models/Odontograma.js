const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Odontograma = sequelize.define('Odontograma', {
    id_odontograma: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_paciente: { type: DataTypes.INTEGER, allowNull: false },
    id_diente: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
        type: DataTypes.ENUM('bien','con_caries','retirado','en_tratamiento','tratamiento_endodoncia'),
        allowNull: false,
        defaultValue: 'bien'
    },
    observaciones: { type: DataTypes.TEXT },
    fecha_actualizacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'odontograma',
    timestamps: false
});

module.exports = Odontograma;