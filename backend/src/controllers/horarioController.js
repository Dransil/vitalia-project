const { Horario } = require('../models/associations');

// Obtener todos los horarios
exports.obtenerHorarios = async (req, res) => {
    try {
        const horarios = await Horario.findAll({
            order: [['id_horario', 'ASC']]
        });

        if (horarios.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron horarios' });
        }

        res.json({ ok: true, msg: 'Horarios obtenidos con éxito', data: horarios });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener horarios', error: error.message });
    }
};

// Obtener horario por ID
exports.obtenerHorarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const horario = await Horario.findByPk(id);

        if (!horario) {
            return res.status(404).json({ ok: false, msg: 'Horario no encontrado' });
        }

        res.json({ ok: true, msg: 'Horario obtenido con éxito', data: horario });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener horario', error: error.message });
    }
};

// Crear horario
exports.crearHorario = async (req, res) => {
    try {
        const nuevoHorario = await Horario.create(req.body);

        res.status(201).json({ ok: true, msg: 'Horario creado con éxito', data: nuevoHorario });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al crear horario', error: error.message });
    }
};