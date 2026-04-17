const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

// Ruta: /vitalia/cotizacion
router.get('/', cotizacionController.obtenerCotizaciones);
router.get('/:id', cotizacionController.obtenerCotizacionPorId);
router.post('/', cotizacionController.crearCotizacion);
router.put('/:id', cotizacionController.actualizarCotizacion);
router.patch('/:id', cotizacionController.cambiarEstadoCotizacion);

module.exports = router;