const { Especialidad } = require('../models/associations');

// Obtener todas las especialidades
exports.obtenerEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidad.findAll({
            order: [['nombre', 'ASC']]
        });

        if (especialidades.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron especialidades' });
        }

        res.json({ ok: true, msg: 'Especialidades obtenidas con éxito', data: especialidades });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener especialidades', error: error.message });
    }
};

// Obtener especialidad por ID
exports.obtenerEspecialidadPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const especialidad = await Especialidad.findByPk(id);

        if (!especialidad) {
            return res.status(404).json({ ok: false, msg: 'Especialidad no encontrada' });
        }

        res.json({ ok: true, msg: 'Especialidad obtenida con éxito', data: especialidad });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener especialidad', error: error.message });
    }
};