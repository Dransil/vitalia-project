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

// Crear historial
exports.crearHistorial = async (req, res) => {
    try {
        const nuevoHistorial = await Historial.create({
            ...req.body,
            registrado_por: req.body.registrado_por // debe venir del body o del token JWT
        });

        const historialCompleto = await Historial.findByPk(nuevoHistorial.id_historial, {
            include: includeCompleto
        });

        res.status(201).json({ ok: true, msg: 'Historial creado con éxito', data: historialCompleto });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ ok: false, msg: 'Esta cita ya tiene un historial registrado' });
        }
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al crear historial', error: error.message });
    }
};