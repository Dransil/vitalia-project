const express = require('express');
const router = express.Router();
const historialdentalController = require('../controllers/historialDentalController');
const upload = require('../middlewares/upload');

const fotosUpload = upload.fields([
    { name: 'foto_antes',   maxCount: 1 },
    { name: 'foto_despues', maxCount: 1 }
]);

// Ruta: /vitalia/historialdental
router.get('/', historialdentalController.obtenerHistorialesDentales);
router.get('/:id', historialdentalController.obtenerHistorialDentalPorId);
router.post('/', fotosUpload ,historialdentalController.crearHistorialDental);
router.put('/:id', fotosUpload, historialdentalController.actualizarHistorialDental);

module.exports = router;