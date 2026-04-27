const express = require('express');
const router = express.Router();
const dienteController = require('../controllers/dienteController');

// Ruta: /vitalia/dientes
router.get('/', dienteController.obtenerDientes);
router.get('/muelas-juicio', dienteController.obtenerMuelasJuicio);
router.get('/cuadrante/:cuadrante', dienteController.obtenerDientesPorCuadrante);

module.exports = router;