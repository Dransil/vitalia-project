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

// Obtener auditoria por ID
exports.obtenerAuditoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const auditoria = await Auditoria.findByPk(id, {
            include: [{ model: Usuario, attributes: ['nombre', 'apellido', 'email'] }]
        });

        if (!auditoria) {
            return res.status(404).json({ ok: false, msg: 'Registro de auditoría no encontrado' });
        }

        res.json({ ok: true, msg: 'Auditoría obtenida con éxito', data: auditoria });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener auditoría', error: error.message });
    }
};

// Obtener auditorias por usuario
exports.obtenerAuditoriasPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const auditorias = await Auditoria.findAll({
            where: { id_usuario },
            order: [['timestamp', 'DESC']]
        });

        if (auditorias.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron auditorías para este usuario' });
        }

        res.json({ ok: true, msg: 'Auditorías obtenidas con éxito', data: auditorias });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener auditorías', error: error.message });
    }
};

// Obtener auditorias por tabla
exports.obtenerAuditoriasPorTabla = async (req, res) => {
    try {
        const { tabla } = req.params;

        const auditorias = await Auditoria.findAll({
            where: { tabla_afectada: tabla },
            include: [{ model: Usuario, attributes: ['nombre', 'apellido'] }],
            order: [['timestamp', 'DESC']]
        });

        if (auditorias.length === 0) {
            return res.status(404).json({ ok: false, msg: `No se encontraron auditorías para la tabla '${tabla}'` });
        }

        res.json({ ok: true, msg: 'Auditorías obtenidas con éxito', data: auditorias });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener auditorías', error: error.message });
    }
};

// Obtener auditorias por rango de fechas
exports.obtenerAuditoriasPorFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ ok: false, msg: 'Debes enviar fecha_inicio y fecha_fin como query params' });
        }

        const auditorias = await Auditoria.findAll({
            where: {
                timestamp: {
                    [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
                }
            },
            include: [{ model: Usuario, attributes: ['nombre', 'apellido'] }],
            order: [['timestamp', 'DESC']]
        });

        if (auditorias.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron auditorías en ese rango de fechas' });
        }

        res.json({ ok: true, msg: 'Auditorías obtenidas con éxito', data: auditorias });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener auditorías', error: error.message });
    }
};