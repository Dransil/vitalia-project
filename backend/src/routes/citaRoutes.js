const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Ruta: /vitalia/citas
router.get('/', citaController.obtenerCitas);
router.post('/', citaController.crearCita);

module.exports = router;