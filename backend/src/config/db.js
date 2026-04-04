const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔧 VERIFICANDO VARIABLES DE ENTORNO:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Cargado' : '✗ No cargado');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
  }
);

// Probar conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a MySQL exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

module.exports = sequelize;