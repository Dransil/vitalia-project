const { Cita, Usuario, Paciente, TipoCita, Horario, UsuarioConsultorioEspecialidad, Consultorio, Especialidad } = require('../models/associations');

// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'Doctor',
                    attributes: ['id_usuario', 'nombre', 'apellido'],
                    include: [{ model: Horario, attributes: ['nombre'] }]
                },
                {
                    model: Paciente,
                    attributes: ['id_paciente', 'nombre', 'apellido', 'cedula']
                },
                {
                    model: TipoCita,
                    attributes: ['nombre', 'duracion_promedio', 'costo_base']
                }
            ],
            order: [['fecha_hora', 'DESC']]
        });

        if (citas.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron citas' });
        }

        res.json({ ok: true, msg: 'Citas obtenidas con éxito', data: citas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener citas', error: error.message });
    }
};