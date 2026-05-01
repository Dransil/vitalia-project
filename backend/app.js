require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Importacion de routes
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const PacienteRoutes = require('./src/routes/pacienteRoutes');
const tipocitaRoutes = require('./src/routes/tipocitaRoutes');
const citaRoutes = require('./src/routes/citaRoutes');
const horarioRoutes = require('./src/routes/horarioRoutes');
const consultorioRoutes = require('./src/routes/consultorioRoutes');
const especialidadRoutes = require('./src/routes/especialidadRoutes');
const historialRoutes = require('./src/routes/historialRoutes');
const cotizacionRoutes = require('./src/routes/cotizacionRoutes');
const historialDentalRoutes = require('./src/routes/historialDentalRoutes');
const auditoriaRoutes = require('./src/routes/auditoriaRoutes');
const dienteRoutes = require('./src/routes/dienteRoutes');
const odontogramaRoutes = require('./src/routes/odontogramaRoutes');
const notificacionRoutes = require('./src/routes/notificacionRoutes');

const authRoutes = require('./src/routes/authRoutes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de prueba
app.get('/test', (req, res) => {
    res.send('Servidor corriendo');
});
// Rutas
app.use('/vitalia/usuarios', usuarioRoutes);
app.use('/vitalia/pacientes', PacienteRoutes);
app.use('/vitalia/tipocita', tipocitaRoutes);
app.use('/vitalia/citas', citaRoutes);
app.use('/vitalia/horarios', horarioRoutes);
app.use('/vitalia/consultorio', consultorioRoutes);
app.use('/vitalia/especialidad', especialidadRoutes);
app.use('/vitalia/historial', historialRoutes);
app.use('/vitalia/historialdental', historialDentalRoutes);
app.use('/vitalia/cotizacion', cotizacionRoutes);
app.use('/vitalia/dientes', dienteRoutes);
app.use('/vitalia/odontograma', odontogramaRoutes);
app.use('/vitalia/notificacion', notificacionRoutes);
app.use('/vitalia/administracion/auditoria', auditoriaRoutes);

app.use('/vitalia/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});