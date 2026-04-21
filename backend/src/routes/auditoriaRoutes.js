const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

// Ruta: /vitalia/administracion/auditoria
router.get('/', auditoriaController.obtenerAuditorias);

module.exports = router;