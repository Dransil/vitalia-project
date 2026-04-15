const { Historial, Cita, Usuario, Paciente, TipoCita } = require('../models/associations');

const includeCompleto = [
    {
        model: Cita,
        include: [
            { model: Usuario, as: 'Doctor', attributes: ['nombre', 'apellido'] },
            { model: Paciente, attributes: ['nombre', 'apellido', 'cedula'] },
            { model: TipoCita, attributes: ['nombre'] }
        ]
    }
];

// Obtener todos los historiales
exports.obtenerHistoriales = async (req, res) => {
    try {
        const historiales = await Historial.findAll({
            include: includeCompleto,
            order: [['fecha_creacion', 'DESC']]
        });

        if (historiales.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron historiales' });
        }

        res.json({ ok: true, msg: 'Historiales obtenidos con éxito', data: historiales });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener historiales', error: error.message });
    }
};

// Obtener historial por ID
exports.obtenerHistorialPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const historial = await Historial.findByPk(id, { include: includeCompleto });

        if (!historial) {
            return res.status(404).json({ ok: false, msg: 'Historial no encontrado' });
        }

        res.json({ ok: true, msg: 'Historial obtenido con éxito', data: historial });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener historial', error: error.message });
    }
};