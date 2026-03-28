require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Importacion de routes
const usuarioRoutes = require('./src/routes/usuarioRoutes');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});