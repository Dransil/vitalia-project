const express = require('express');
const router = express.Router();
const historialdentalController = require('../controllers/historialDentalController');
const upload = require('../middlewares/upload');

// Ruta: /vitalia/historialdental
router.get('/', historialdentalController.obtenerHistorialesDentales);
router.get('/:id', historialdentalController.obtenerHistorialDentalPorId);
router.post('/', historialdentalController.crearHistorialDental);
router.put('/:id', historialdentalController.actualizarHistorialDental);

module.exports = router;