const { HistorialDental, Historial, Cita, Paciente, Usuario } = require('../models/associations');

// Include reutilizable
const includeCompleto = [
    {
        model: Historial,
        include: [
            {
                model: Cita,
                include: [
                    { model: Usuario, as: 'Doctor', attributes: ['nombre', 'apellido'] },
                    { model: Paciente, attributes: ['nombre', 'apellido', 'cedula'] }
                ]
            }
        ]
    }
];

// Obtener todos los historiales dentales
exports.obtenerHistorialesDentales = async (req, res) => {
    try {
        const historiales = await HistorialDental.findAll({
            include: includeCompleto,
            order: [['fecha_registro', 'DESC']]
        });

        if (historiales.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron historiales dentales' });
        }

        res.json({ ok: true, msg: 'Historiales dentales obtenidos con éxito', data: historiales });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener historiales dentales', error: error.message });
    }
};

// Obtener historial dental por ID
exports.obtenerHistorialDentalPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const historial = await HistorialDental.findByPk(id, { include: includeCompleto });

        if (!historial) {
            return res.status(404).json({ ok: false, msg: 'Historial dental no encontrado' });
        }

        res.json({ ok: true, msg: 'Historial dental obtenido con éxito', data: historial });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener historial dental', error: error.message });
    }
};