const { Historial, Cita, Usuario, Paciente, TipoCita } = require('../models/associations');

const includeCompleto = [
    {
        model: Cita,
        include: [
            { model: Usuario, as: 'Doctor', attributes: ['nombre', 'apellido'] },
            { model: Paciente, attributes: ['nombre', 'apellido', 'cedula'] },
            { model: TipoCita, attributes: ['nombre'] }
        ]
    }
];

