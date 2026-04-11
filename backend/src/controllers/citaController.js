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

// Obtener cita por ID
exports.obtenerCitaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'Doctor',
                    attributes: ['id_usuario', 'nombre', 'apellido'],
                    include: [{ model: Horario, attributes: ['nombre'] }]
                },
                {
                    model: Paciente,
                    attributes: ['id_paciente', 'nombre', 'apellido', 'cedula', 'telefono']
                },
                {
                    model: TipoCita,
                    attributes: ['nombre', 'duracion_promedio', 'costo_base']
                }
            ]
        });

        if (!cita) {
            return res.status(404).json({ ok: false, msg: 'Cita no encontrada' });
        }

        res.json({ ok: true, msg: 'Cita obtenida con éxito', data: cita });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener cita', error: error.message });
    }
};

// Obtener citas por doctor
exports.obtenerCitasPorDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const citas = await Cita.findAll({
            where: { id_usuario: id },
            include: [
                {
                    model: Paciente,
                    attributes: ['id_paciente', 'nombre', 'apellido', 'cedula', 'telefono']
                },
                {
                    model: TipoCita,
                    attributes: ['nombre', 'duracion_promedio', 'costo_base']
                }
            ],
            order: [['fecha_hora', 'DESC']]
        });

        if (citas.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron citas para este doctor' });
        }

        res.json({ ok: true, msg: 'Citas obtenidas con éxito', data: citas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener citas', error: error.message });
    }
};

// Obtener citas por paciente
exports.obtenerCitasPorPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const citas = await Cita.findAll({
            where: { id_paciente: id },
            include: [
                {
                    model: Usuario,
                    as: 'Doctor',
                    attributes: ['id_usuario', 'nombre', 'apellido']
                },
                {
                    model: TipoCita,
                    attributes: ['nombre', 'duracion_promedio', 'costo_base']
                }
            ],
            order: [['fecha_hora', 'DESC']]
        });

        if (citas.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron citas para este paciente' });
        }

        res.json({ ok: true, msg: 'Citas obtenidas con éxito', data: citas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener citas', error: error.message });
    }
};

// Crear cita
exports.crearCita = async (req, res) => {
    try {
        const nuevaCita = await Cita.create(req.body);

        const citaCompleta = await Cita.findByPk(nuevaCita.id_cita, {
            include: [
                { model: Usuario,  as: 'Doctor', attributes: ['nombre', 'apellido'] },
                { model: Paciente, attributes: ['nombre', 'apellido'] },
                { model: TipoCita, attributes: ['nombre', 'costo_base'] }
            ]
        });

        res.status(201).json({ ok: true, msg: 'Cita creada con éxito', data: citaCompleta });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al crear cita', error: error.message });
    }
};

// Actualizar cita
exports.actualizarCita = async (req, res) => {
    try {
        const { id } = req.params;

        const [actualizado] = await Cita.update(req.body, { where: { id_cita: id } });

        if (!actualizado) {
            return res.status(404).json({ ok: false, msg: 'Cita no encontrada' });
        }

        const citaActualizada = await Cita.findByPk(id, {
            include: [
                { model: Usuario,  as: 'Doctor', attributes: ['nombre', 'apellido'] },
                { model: Paciente, attributes: ['nombre', 'apellido'] },
                { model: TipoCita, attributes: ['nombre', 'costo_base'] }
            ]
        });

        res.json({ ok: true, msg: 'Cita actualizada con éxito', data: citaActualizada });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al actualizar cita', error: error.message });
    }
};