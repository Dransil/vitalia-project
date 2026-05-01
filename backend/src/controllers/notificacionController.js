const { Notificacion, Usuario, Cita, Paciente, TipoCita } = require('../models/associations');

const includeCompleto = [
    { model: Usuario, attributes: ['nombre', 'apellido', 'email'] },
    {
        model: Cita,
        attributes: ['id_cita', 'fecha_hora', 'estado'],
        include: [{ model: Paciente, attributes: ['nombre', 'apellido'] }]
    }
];

// Obtener todas las notificaciones
exports.obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll({
            include: includeCompleto,
            order: [['fecha_creacion', 'DESC']]
        });

        if (notificaciones.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron notificaciones' });
        }

        res.json({ ok: true, msg: 'Notificaciones obtenidas con éxito', data: notificaciones });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener notificaciones', error: error.message });
    }
};

// Obtener notificaciones por usuario
exports.obtenerNotificacionesPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const notificaciones = await Notificacion.findAll({
            where: { id_usuario },
            include: [
                {
                    model: Cita,
                    attributes: ['id_cita', 'fecha_hora', 'estado'],
                    include: [{ model: Paciente, attributes: ['nombre', 'apellido'] }]
                }
            ],
            order: [['fecha_creacion', 'DESC']]
        });

        if (notificaciones.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron notificaciones para este usuario' });
        }

        res.json({ ok: true, msg: 'Notificaciones obtenidas con éxito', data: notificaciones });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener notificaciones', error: error.message });
    }
};

// Obtener notificaciones pendientes de un usuario
exports.obtenerNotificacionesPendientes = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const notificaciones = await Notificacion.findAll({
            where: { id_usuario, estado: 'pendiente' },
            include: [
                {
                    model: Cita,
                    attributes: ['id_cita', 'fecha_hora'],
                    include: [{ model: Paciente, attributes: ['nombre', 'apellido'] }]
                }
            ],
            order: [['fecha_creacion', 'DESC']]
        });

        res.json({
            ok: true,
            msg: 'Notificaciones pendientes obtenidas con éxito',
            total: notificaciones.length,
            data: notificaciones
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener notificaciones pendientes', error: error.message });
    }
};
