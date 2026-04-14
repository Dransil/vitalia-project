const express = require('express');
const router = express.Router();
const consultorioController = require('../controllers/consultorioController');

// Ruta: /vitalia/consultorio
router.get('/', consultorioController.obtenerConsultorios);
router.get('/:id', consultorioController.obtenerConsultorioPorId);
router.post('/', consultorioController.crearConsultorio);
router.put('/:id', consultorioController.actualizarConsultorio);
router.patch('/:id', consultorioController.cambiarEstadoConsultorio);
router.delete('/:id', consultorioController.eliminarConsultorio);

module.exports = router;