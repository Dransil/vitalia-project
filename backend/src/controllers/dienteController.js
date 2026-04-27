const { Diente } = require('../models/associations');

// Obtener todos los dientes
exports.obtenerDientes = async (req, res) => {
    try {
        const dientes = await Diente.findAll({
            order: [['numero_fdi', 'ASC']]
        });

        res.json({ ok: true, msg: 'Dientes obtenidos con éxito', data: dientes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener dientes', error: error.message });
    }
};

// Obtener dientes por cuadrante
exports.obtenerDientesPorCuadrante = async (req, res) => {
    try {
        const { cuadrante } = req.params;

        const dientes = await Diente.findAll({
            where: { cuadrante },
            order: [['numero_fdi', 'ASC']]
        });

        if (dientes.length === 0) {
            return res.status(404).json({ ok: false, msg: `No se encontraron dientes para el cuadrante '${cuadrante}'` });
        }

        res.json({ ok: true, msg: 'Dientes obtenidos con éxito', data: dientes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener dientes', error: error.message });
    }
};

// Obtener solo muelas del juicio
exports.obtenerMuelasJuicio = async (req, res) => {
    try {
        const muelas = await Diente.findAll({
            where: { es_muela_juicio: true },
            order: [['numero_fdi', 'ASC']]
        });

        res.json({ ok: true, msg: 'Muelas del juicio obtenidas con éxito', data: muelas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener muelas del juicio', error: error.message });
    }
};