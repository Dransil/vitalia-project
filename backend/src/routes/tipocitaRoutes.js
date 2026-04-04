const express = require('express');
const router = express.Router();
const tipocitaController = require('../controllers/tipocitaController');

// Ruta: /vitalia/tipocita
router.get('/', tipocitaController.obtenerTiposCita);

module.exports = router;
