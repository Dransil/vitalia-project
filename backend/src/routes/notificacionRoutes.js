const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

// Ruta: /vitalia/notificacion
router.get('/', notificacionController.obtenerNotificaciones);
router.get('/:id_usuario', notificacionController.obtenerNotificacionesPorUsuario);
router.get('/:id_usuario/pendientes', notificacionController.obtenerNotificacionesPendientes);
router.post('/', notificacionController.obtenerNotificaciones);

module.exports = router;