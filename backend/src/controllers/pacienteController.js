const { Paciente } = require('../models/associations');

// Obtener todos los pacientes
exports.obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            where: { estado: 'activo' },
            order: [['apellido', 'ASC']]
        });
        res.json({ ok: true, data: pacientes });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al obtener pacientes', error: error.message });
    }
};

// Crear paciente
exports.crearPaciente = async (req, res) => {
    try {
        const nuevoPaciente = await Paciente.create(req.body);
        res.status(201).json({ ok: true, msg: 'Paciente registrado con éxito', data: nuevoPaciente });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ ok: false, msg: 'La cédula ya existe en el sistema' });
        }
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Activar/desactivar paciente
exports.cambiarEstadoPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findByPk(id);
        if (!paciente) return res.status(404).json({ ok: false, msg: 'Paciente no encontrado' });
        const nuevoEstado = (paciente.estado === 'activo') ? 'inactivo' : 'activo';
        await paciente.update({ estado: nuevoEstado });
        res.json({
            ok: true,
            msg: `El estado del paciente ${paciente.nombre} ahora es: ${nuevoEstado}`,
            estado: nuevoEstado
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};