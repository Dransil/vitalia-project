const express = require('express');
const router = express.Router();
const historialdentalController = require('../controllers/historialDentalController');

// Ruta: /vitalia/historialdental
router.get('/', historialdentalController.obtenerHistorialesDentales);
router.get('/:id', historialdentalController.obtenerHistorialDentalPorId);

module.exports = router;