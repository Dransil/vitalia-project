const { Consultorio } = require('../models/associations');

// Obtener todos los consultorios
exports.obtenerConsultorios = async (req, res) => {
    try {
        const consultorios = await Consultorio.findAll({
            order: [['nombre', 'ASC']]
        });

        if (consultorios.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron consultorios' });
        }

        res.json({ ok: true, msg: 'Consultorios obtenidos con éxito', data: consultorios });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener consultorios', error: error.message });
    }
};

// Obtener consultorio por ID
exports.obtenerConsultorioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const consultorio = await Consultorio.findByPk(id);

        if (!consultorio) {
            return res.status(404).json({ ok: false, msg: 'Consultorio no encontrado' });
        }

        res.json({ ok: true, msg: 'Consultorio obtenido con éxito', data: consultorio });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener consultorio', error: error.message });
    }
};

// Crear consultorio
exports.crearConsultorio = async (req, res) => {
    try {
        const nuevoConsultorio = await Consultorio.create(req.body);

        res.status(201).json({ ok: true, msg: 'Consultorio creado con éxito', data: nuevoConsultorio });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al crear consultorio', error: error.message });
    }
};

// Actualizar consultorio
exports.actualizarConsultorio = async (req, res) => {
    try {
        const { id } = req.params;

        const consultorio = await Consultorio.findByPk(id);

        if (!consultorio) {
            return res.status(404).json({ ok: false, msg: 'Consultorio no encontrado' });
        }

        await consultorio.update(req.body);

        res.json({ ok: true, msg: 'Consultorio actualizado con éxito', data: consultorio });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al actualizar consultorio', error: error.message });
    }
};

// Cambiar estado del consultorio
exports.cambiarEstadoConsultorio = async (req, res) => {
    try {
        const { id } = req.params;

        const consultorio = await Consultorio.findByPk(id);

        if (!consultorio) {
            return res.status(404).json({ ok: false, msg: 'Consultorio no encontrado' });
        }

        const nuevoEstado = consultorio.estado === 'activo' ? 'inactivo' : 'activo';
        await consultorio.update({ estado: nuevoEstado });

        res.json({
            ok: true,
            msg: `El estado del consultorio ${consultorio.nombre} ahora es: ${nuevoEstado}`,
            estado: nuevoEstado
        });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al cambiar estado', error: error.message });
    }
};

// Eliminar consultorio
exports.eliminarConsultorio = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminado = await Consultorio.destroy({ where: { id_consultorio: id } });

        if (!eliminado) {
            return res.status(404).json({ ok: false, msg: 'Consultorio no encontrado' });
        }

        res.json({ ok: true, msg: 'Consultorio eliminado con éxito' });

    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al eliminar consultorio', error: error.message });
    }
};