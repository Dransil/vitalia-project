const { Notificacion, Usuario, Cita, Paciente, TipoCita } = require('../models/associations');

const includeCompleto = [
    { model: Usuario, attributes: ['nombre', 'apellido', 'email'] },
    {
        model: Cita,
        attributes: ['id_cita', 'fecha_hora', 'estado'],
        include: [{ model: Paciente, attributes: ['nombre', 'apellido'] }]
    }
];