const { HistorialDental, Historial, Cita, Paciente, Usuario } = require('../models/associations');

// Include reutilizable
const includeCompleto = [
    {
        model: Historial,
        include: [
            {
                model: Cita,
                include: [
                    { model: Usuario, as: 'Doctor', attributes: ['nombre', 'apellido'] },
                    { model: Paciente, attributes: ['nombre', 'apellido', 'cedula'] }
                ]
            }
        ]
    }
];

// Obtener todos los historiales dentales
exports.obtenerHistorialesDentales = async (req, res) => {
    try {
        const historiales = await HistorialDental.findAll({
            include: includeCompleto,
            order: [['fecha_registro', 'DESC']]
        });

        if (historiales.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron historiales dentales' });
        }

        res.json({ ok: true, msg: 'Historiales dentales obtenidos con éxito', data: historiales });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener historiales dentales', error: error.message });
    }
};

// Obtener historial dental por ID
exports.obtenerHistorialDentalPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const historial = await HistorialDental.findByPk(id, { include: includeCompleto });

        if (!historial) {
            return res.status(404).json({ ok: false, msg: 'Historial dental no encontrado' });
        }

        res.json({ ok: true, msg: 'Historial dental obtenido con éxito', data: historial });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener historial dental', error: error.message });
    }
};

// Crear historial dental
exports.crearHistorialDental = async (req, res) => {
    try {
        const nuevoHistorial = await HistorialDental.create(req.body);

        const historialCompleto = await HistorialDental.findByPk(nuevoHistorial.id_historial_dental, {
            include: includeCompleto
        });

        res.status(201).json({ ok: true, msg: 'Historial dental creado con éxito', data: historialCompleto });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al crear historial dental', error: error.message });
    }
};

// Actualizar historial dental
exports.actualizarHistorialDental = async (req, res) => {
    try {
        const { id } = req.params;

        const historial = await HistorialDental.findByPk(id);

        if (!historial) {
            return res.status(404).json({ ok: false, msg: 'Historial dental no encontrado' });
        }

        await historial.update(req.body);

        const historialActualizado = await HistorialDental.findByPk(id, { include: includeCompleto });

        res.json({ ok: true, msg: 'Historial dental actualizado con éxito', data: historialActualizado });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al actualizar historial dental', error: error.message });
    }
};

// VER BIEN

// Crear historial dental con fotos
exports.crearHistorialDental = async (req, res) => {
    try {
        const datos = { ...req.body };

        // Si se subieron fotos, construir la URL
        if (req.files?.foto_antes) {
            datos.url_foto_antes = `${req.protocol}://${req.get('host')}/uploads/${req.files.foto_antes[0].filename}`;
        }
        if (req.files?.foto_despues) {
            datos.url_foto_despues = `${req.protocol}://${req.get('host')}/uploads/${req.files.foto_despues[0].filename}`;
        }

        const nuevoHistorial = await HistorialDental.create(datos);

        const historialCompleto = await HistorialDental.findByPk(nuevoHistorial.id_historial_dental, {
            include: includeCompleto
        });

        res.status(201).json({ ok: true, msg: 'Historial dental creado con éxito', data: historialCompleto });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al crear historial dental', error: error.message });
    }
};
// Actualizar historial dental con fotos
exports.actualizarHistorialDental = async (req, res) => {
    try {
        const { id } = req.params;

        const historial = await HistorialDental.findByPk(id);

        if (!historial) {
            return res.status(404).json({ ok: false, msg: 'Historial dental no encontrado' });
        }

        const datos = { ...req.body };

        if (req.files?.foto_antes) {
            datos.url_foto_antes = `${req.protocol}://${req.get('host')}/uploads/${req.files.foto_antes[0].filename}`;
        }
        if (req.files?.foto_despues) {
            datos.url_foto_despues = `${req.protocol}://${req.get('host')}/uploads/${req.files.foto_despues[0].filename}`;
        }

        await historial.update(datos);

        const historialActualizado = await HistorialDental.findByPk(id, { include: includeCompleto });

        res.json({ ok: true, msg: 'Historial dental actualizado con éxito', data: historialActualizado });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al actualizar historial dental', error: error.message });
    }
};