const express = require('express');
const router = express.Router();
const consultorioController = require('../controllers/consultorioController');

// Ruta: /vitalia/consultorio
router.get('/', consultorioController.obtenerConsultorios);
router.get('/:id', consultorioController.obtenerConsultorioPorId);

module.exports = router;