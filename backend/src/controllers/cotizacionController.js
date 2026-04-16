const { Cotizacion, Cita, Usuario, Paciente, TipoCita } = require('../models/associations');

const includeCompleto = [
    {
        model: Cita,
        include: [
            { model: Usuario, as: 'Doctor', attributes: ['nombre', 'apellido'] },
            { model: Paciente, attributes: ['nombre', 'apellido', 'cedula'] },
            { model: TipoCita, attributes: ['nombre', 'costo_base'] }
        ]
    }
];

// Obtener todas las cotizaciones
exports.obtenerCotizaciones = async (req, res) => {
    try {
        const cotizaciones = await Cotizacion.findAll({
            include: includeCompleto,
            order: [['fecha_cotizacion', 'DESC']]
        });

        if (cotizaciones.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron cotizaciones' });
        }

        res.json({ ok: true, msg: 'Cotizaciones obtenidas con éxito', data: cotizaciones });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener cotizaciones', error: error.message });
    }
};

// Obtener cotizacion por ID
exports.obtenerCotizacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cotizacion = await Cotizacion.findByPk(id, { include: includeCompleto });

        if (!cotizacion) {
            return res.status(404).json({ ok: false, msg: 'Cotización no encontrada' });
        }

        res.json({ ok: true, msg: 'Cotización obtenida con éxito', data: cotizacion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener cotización', error: error.message });
    }
};