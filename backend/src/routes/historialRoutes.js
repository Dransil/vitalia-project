const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');

// Ruta: /vitalia/historial
router.get('/', historialController.obtenerHistoriales);
router.get('/:id', historialController.obtenerHistorialPorId);

module.exports = router;