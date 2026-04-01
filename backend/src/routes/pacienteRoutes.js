const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta: /vitalia/pacientes
router.get('/', pacienteController.obtenerPacientes);

module.exports = router;