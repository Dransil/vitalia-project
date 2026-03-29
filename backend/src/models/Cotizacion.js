const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cotizacion = sequelize.define('Cotizacion', {
  id_cotizacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cita: { 
    type: DataTypes.INTEGER, 
    unique: true, 
    allowNull: false,
    comment: 'Relación 1:1 con cita'
  },
  valor_base: { type: DataTypes.DECIMAL(10, 2) },
  valor_servicios_adicionales: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  subtotal: { type: DataTypes.DECIMAL(10, 2) },
  descuento_porcentaje: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
  descuento_monto: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  total: { type: DataTypes.DECIMAL(10, 2) },
  estado: { 
    type: DataTypes.ENUM('cotizacion', 'facturado', 'pagado', 'pendiente'), 
    defaultValue: 'cotizacion' 
  },
  metodo_pago: { type: DataTypes.STRING(50) },
  referencia_pago: { type: DataTypes.STRING(100) },
  fecha_cotizacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_pago: { type: DataTypes.DATE }
}, {
  tableName: 'cotizacion',
  timestamps: false
});

module.exports = Cotizacion;