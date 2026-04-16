const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

// Ruta: /vitalia/cotizacion
router.get('/', cotizacionController.obtenerCotizaciones);

module.exports = router;