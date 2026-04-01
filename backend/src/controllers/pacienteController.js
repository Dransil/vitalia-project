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