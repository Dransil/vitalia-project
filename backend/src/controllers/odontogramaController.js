const { Odontograma, Diente, Paciente } = require('../models/associations');

const includeCompleto = [
    { model: Diente,   attributes: ['id_diente', 'numero_fdi', 'nombre', 'cuadrante', 'es_muela_juicio'] },
    { model: Paciente, attributes: ['id_paciente', 'nombre', 'apellido', 'cedula'] }
];

// Obtener odontograma completo de un paciente
exports.obtenerOdontogramaPorPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params;

        const odontograma = await Odontograma.findAll({
            where: { id_paciente },
            include: includeCompleto,
            order: [[ Diente, 'numero_fdi', 'ASC' ]]
        });

        if (odontograma.length === 0) {
            return res.status(404).json({ ok: false, msg: 'Este paciente no tiene odontograma registrado' });
        }

        res.json({ ok: true, msg: 'Odontograma obtenido con éxito', data: odontograma });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener odontograma', error: error.message });
    }
};