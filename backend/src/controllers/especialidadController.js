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

// Crear especialidad
exports.crearEspecialidad = async (req, res) => {
    try {
        const nuevaEspecialidad = await Especialidad.create(req.body);

        res.status(201).json({ ok: true, msg: 'Especialidad creada con éxito', data: nuevaEspecialidad });

    } catch (error) {
        // El nombre tiene UNIQUE KEY, si se duplica Sequelize lanza un error específico
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ ok: false, msg: 'Ya existe una especialidad con ese nombre' });
        }
        res.status(500).json({ ok: false, msg: 'Error al crear especialidad', error: error.message });
    }
};

// Actualizar especialidad
exports.actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;

        const especialidad = await Especialidad.findByPk(id);

        if (!especialidad) {
            return res.status(404).json({ ok: false, msg: 'Especialidad no encontrada' });
        }

        await especialidad.update(req.body);

        res.json({ ok: true, msg: 'Especialidad actualizada con éxito', data: especialidad });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ ok: false, msg: 'Ya existe una especialidad con ese nombre' });
        }
        res.status(500).json({ ok: false, msg: 'Error al actualizar especialidad', error: error.message });
    }
};

// Cambiar estado de la especialidad
exports.cambiarEstadoEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;

        const especialidad = await Especialidad.findByPk(id);

        if (!especialidad) {
            return res.status(404).json({ ok: false, msg: 'Especialidad no encontrada' });
        }

        const nuevoEstado = especialidad.estado === 'activa' ? 'inactiva' : 'activa';
        await especialidad.update({ estado: nuevoEstado });

        res.json({
            ok: true,
            msg: `El estado de ${especialidad.nombre} ahora es: ${nuevoEstado}`,
            estado: nuevoEstado
        });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al cambiar estado', error: error.message });
    }
};
