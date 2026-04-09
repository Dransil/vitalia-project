const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Ruta: /vitalia/citas
router.get('/', citaController.obtenerCitas);

module.exports = router;