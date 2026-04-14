const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');

// Ruta: /vitalia/especialidad
router.get('/', especialidadController.obtenerEspecialidades);
router.get('/:id', especialidadController.obtenerEspecialidadPorId);
router.post('/', especialidadController.crearEspecialidad);

module.exports = router;