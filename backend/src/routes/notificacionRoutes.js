const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

// Ruta: /vitalia/notificacion
router.get('/', notificacionController.obtenerNotificaciones);
router.get('/:id_usuario', notificacionController.obtenerNotificacionesPorUsuario);
router.get('/:id_usuario/pendientes', notificacionController.obtenerNotificacionesPendientes);
router.post('/', notificacionController.crearNotificacion);
router.patch('/:id/leer', notificacionController.marcarComoLeida);
router.patch('/usuario/:id_usuario/leer', notificacionController.marcarComoLeida);

module.exports = router;