const { Cotizacion, Cita, Usuario, Paciente, TipoCita } = require('../models/associations');

// La tabla cotizacion tiene relación de 1 a 1 con la tabla citas, por lo que se debe
// tener en cuenta dicha restricción al momento de crear una cotizacion para dicha
// cita y que no haya registros que se repitan.

const includeCompleto = [
    {
        model: Cita,
        include: [
            { model: Usuario, as: 'Doctor', attributes: ['nombre', 'apellido'] },
            { model: Paciente, attributes: ['nombre', 'apellido', 'cedula'] },
            { model: TipoCita, attributes: ['nombre', 'costo_base'] }
        ]
    }
];

// Obtener todas las cotizaciones
exports.obtenerCotizaciones = async (req, res) => {
    try {
        const cotizaciones = await Cotizacion.findAll({
            include: includeCompleto,
            order: [['fecha_cotizacion', 'DESC']]
        });

        if (cotizaciones.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron cotizaciones' });
        }

        res.json({ ok: true, msg: 'Cotizaciones obtenidas con éxito', data: cotizaciones });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener cotizaciones', error: error.message });
    }
};

// Obtener cotizacion por ID
exports.obtenerCotizacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cotizacion = await Cotizacion.findByPk(id, { include: includeCompleto });

        if (!cotizacion) {
            return res.status(404).json({ ok: false, msg: 'Cotización no encontrada' });
        }

        res.json({ ok: true, msg: 'Cotización obtenida con éxito', data: cotizacion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener cotización', error: error.message });
    }
};

// Crear cotizacion
exports.crearCotizacion = async (req, res) => {
    try {
        const { valor_base, valor_servicios_adicionales = 0, descuento_porcentaje = 0 } = req.body;

        // Calcular subtotal y total automáticamente
        const subtotal = parseFloat(valor_base) + parseFloat(valor_servicios_adicionales);
        const descuento_monto = subtotal * (parseFloat(descuento_porcentaje) / 100);
        const total = subtotal - descuento_monto;

        const nuevaCotizacion = await Cotizacion.create({
            ...req.body,
            subtotal,
            descuento_monto,
            total
        });

        const cotizacionCompleta = await Cotizacion.findByPk(nuevaCotizacion.id_cotizacion, {
            include: includeCompleto
        });

        res.status(201).json({ ok: true, msg: 'Cotización creada con éxito', data: cotizacionCompleta });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ ok: false, msg: 'Esta cita ya tiene una cotización registrada' });
        }
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al crear cotización', error: error.message });
    }
};

// Actualizar cotizacion
exports.actualizarCotizacion = async (req, res) => {
    try {
        const { id } = req.params;

        const cotizacion = await Cotizacion.findByPk(id);

        if (!cotizacion) {
            return res.status(404).json({ ok: false, msg: 'Cotización no encontrada' });
        }

        // Recalcular totales si vienen campos que los afectan
        const valor_base = req.body.valor_base ?? cotizacion.valor_base;
        const valor_servicios_adicionales = req.body.valor_servicios_adicionales ?? cotizacion.valor_servicios_adicionales;
        const descuento_porcentaje = req.body.descuento_porcentaje ?? cotizacion.descuento_porcentaje;

        const subtotal = parseFloat(valor_base) + parseFloat(valor_servicios_adicionales);
        const descuento_monto = subtotal * (parseFloat(descuento_porcentaje) / 100);
        const total = subtotal - descuento_monto;

        await cotizacion.update({
            ...req.body,
            subtotal,
            descuento_monto,
            total
        });

        const cotizacionActualizada = await Cotizacion.findByPk(id, { include: includeCompleto });

        res.json({ ok: true, msg: 'Cotización actualizada con éxito', data: cotizacionActualizada });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al actualizar cotización', error: error.message });
    }
};
