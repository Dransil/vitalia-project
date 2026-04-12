const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Ruta: /vitalia/citas
router.get('/', citaController.obtenerCitas);
router.get('/:id', citaController.obtenerCitaPorId);
router.get('/doctor/:id', citaController.obtenerCitasPorDoctor);
router.get('/paciente/:id', citaController.obtenerCitasPorPaciente);
router.post('/', citaController.crearCita);
router.put('/:id', citaController.actualizarCita);
router.patch('/estado/:id', citaController.cambiarEstadoCita);

module.exports = router;