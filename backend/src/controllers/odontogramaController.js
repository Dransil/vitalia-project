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

// Obtener estado de un diente específico de un paciente
exports.obtenerDientePorPaciente = async (req, res) => {
    try {
        const { id_paciente, id_diente } = req.params;

        const diente = await Odontograma.findOne({
            where: { id_paciente, id_diente },
            include: includeCompleto
        });

        if (!diente) {
            return res.status(404).json({ ok: false, msg: 'No se encontró registro para este diente' });
        }

        res.json({ ok: true, msg: 'Diente obtenido con éxito', data: diente });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener diente', error: error.message });
    }
};

// Inicializar odontograma de un paciente (crea los 32 dientes en 'bien')
exports.inicializarOdontograma = async (req, res) => {
    try {
        const { id_paciente } = req.params;

        // Verificar que no tenga ya un odontograma
        const existe = await Odontograma.findOne({ where: { id_paciente } });
        if (existe) {
            return res.status(400).json({ ok: false, msg: 'Este paciente ya tiene un odontograma inicializado' });
        }

        // Traer todos los dientes del catálogo
        const dientes = await Diente.findAll();

        // Crear una fila por cada diente con estado 'bien'
        const registros = dientes.map(d => ({
            id_paciente: parseInt(id_paciente),
            id_diente:   d.id_diente,
            estado:      'bien'
        }));

        await Odontograma.bulkCreate(registros);

        res.status(201).json({ ok: true, msg: 'Odontograma inicializado con éxito — 32 dientes creados en estado bien' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al inicializar odontograma', error: error.message });
    }
};