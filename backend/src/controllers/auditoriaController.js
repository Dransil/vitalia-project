const { Auditoria, Usuario } = require('../models/associations');

// Obtener todas las auditorias
exports.obtenerAuditorias = async (req, res) => {
    try {
        const auditorias = await Auditoria.findAll({
            include: [{ model: Usuario, attributes: ['nombre', 'apellido', 'email'] }],
            order: [['timestamp', 'DESC']]
        });

        if (auditorias.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron registros de auditoría' });
        }

        res.json({ ok: true, msg: 'Auditorías obtenidas con éxito', data: auditorias });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener auditorías', error: error.message });
    }
};
