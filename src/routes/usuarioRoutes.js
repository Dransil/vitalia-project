const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta: GET /vitualia/usuarios
router.get('/', usuarioController.obtenerUsuarios);

module.exports = router;