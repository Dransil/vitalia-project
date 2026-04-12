const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

// Ruta: /vitalia/horario
router.get('/', horarioController.obtenerHorarios);
router.get('/:id', horarioController.obtenerHorarioPorId);

module.exports = router;