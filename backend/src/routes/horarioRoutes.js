const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

// Ruta: /vitalia/horarios
router.get('/', horarioController.obtenerHorarios);
router.get('/:id', horarioController.obtenerHorarioPorId);
router.post('/', horarioController.crearHorario);

module.exports = router;