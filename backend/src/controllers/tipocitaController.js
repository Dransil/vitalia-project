const { TipoCita } = require('../models/associations');

// Obtener citas activas
exports.obtenerTiposCita = async (req, res) => {
    try {
        const tipos = await TipoCita.findAll({
            where: { estado: 'activo' },
            order: [['nombre', 'ASC']]
        });
        res.json({ ok: true, data: tipos });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener tipos de cita', error: error.message });
    }
};
