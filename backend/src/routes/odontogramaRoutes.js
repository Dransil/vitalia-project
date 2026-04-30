const express = require('express');
const router = express.Router();
const odontogramaController = require('../controllers/odontogramaController');

// Ruta: /vitalia/odontograma
router.get('/paciente/:id_paciente', odontogramaController.obtenerOdontogramaPorPaciente);

module.exports = router;