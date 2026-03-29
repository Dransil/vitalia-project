const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta: /vitalia/usuarios
router.get('/', usuarioController.obtenerUsuarios);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);

module.exports = router;