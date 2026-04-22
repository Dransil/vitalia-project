const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

// Ruta: /vitalia/administracion/auditoria
router.get('/', auditoriaController.obtenerAuditorias);
router.get('/:id', auditoriaController.obtenerAuditoriaPorId);
router.get('/usuarios/:id_usuario', auditoriaController.obtenerAuditoriasPorUsuario);
router.get('/tabla/:id_tabla', auditoriaController.obtenerAuditoriasPorTabla);
router.get('/fechas', auditoriaController.obtenerAuditoriasPorFecha);

module.exports = router;