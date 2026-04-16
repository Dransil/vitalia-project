require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Importacion de routes
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const PacienteRoutes = require('./src/routes/pacienteRoutes');
const tipocitaRoutes = require('./src/routes/tipocitaRoutes');
const citaRoutes = require('./src/routes/citaRoutes')
const horarioRoutes = require('./src/routes/horarioRoutes')
const consultorioRoutes = require('./src/routes/consultorioRoutes')
const especialidadRoutes = require('./src/routes/especialidadRoutes')
const historialRoutes = require('./src/routes/historialRoutes')
const cotizacionRoutes = require('./src/routes/cotizacionRoutes')

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
app.use('/vitalia/cotizacion', cotizacionRoutes);

app.use('/vitalia/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});