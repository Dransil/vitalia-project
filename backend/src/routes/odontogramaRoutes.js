const express = require('express');
const router = express.Router();
const odontogramaController = require('../controllers/odontogramaController');

// Ruta: /vitalia/odontograma
router.get('/paciente/:id_paciente', odontogramaController.obtenerOdontogramaPorPaciente);
router.get('/paciente/:id_paciente/diente/:id_diente', odontogramaController.obtenerDientePorPaciente);
router.post('/paciente/:id_paciente/iniciar', odontogramaController.inicializarOdontograma);

module.exports = router;