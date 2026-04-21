const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

// Ruta: /vitalia/administracion/auditoria
router.get('/', auditoriaController.obtenerAuditorias);
router.get('/:id', auditoriaController.obtenerAuditoriaPorId);
router.get('/usuarios/:id_usuario', auditoriaController.obtenerAuditoriasPorUsuario);

module.exports = router;