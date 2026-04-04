const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta: /vitalia/pacientes
router.get('/', pacienteController.obtenerPacientes);
router.post('/', pacienteController.crearPaciente);
router.patch('/estado/:id', pacienteController.cambiarEstadoPaciente);
router.put('/:id', pacienteController.actualizarPaciente);

module.exports = router;