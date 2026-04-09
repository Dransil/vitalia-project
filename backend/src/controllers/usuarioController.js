const { Usuario, Especialidad, Consultorio, Horario, UsuarioConsultorioEspecialidad } = require('../models/associations');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id_usuario', 'nombre', 'apellido', 'email', 'rol', 'estado', 'telefono', 'dias_atencion'],
            include: [
                {
                    model: Horario,
                    attributes: ['nombre', 'horario_inicio', 'horario_fin']
                },
                {
                    model: UsuarioConsultorioEspecialidad,
                    as: 'asignaciones',
                    attributes: ['id', 'estado'],
                    include: [
                        { model: Consultorio,  attributes: ['nombre', 'ciudad'] },
                        { model: Especialidad, attributes: ['nombre'] }
                    ]
                }
            ]
        });

        if (usuarios.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron usuarios' });
        }

        res.json({ ok: true, msg: 'Usuarios obtenidos con éxito', data: usuarios });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener usuarios', error: error.message });
    }
};

// Crear usuario
exports.crearUsuario = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { contraseña_hash, id_consultorio, id_especialidad, ...datos } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const passwordEncriptada = bcrypt.hashSync(contraseña_hash, salt);

        // Paso 1: crear el usuario
        const nuevoUsuario = await Usuario.create({
            ...datos,
            contraseña_hash: passwordEncriptada
        }, { transaction: t });

        await UsuarioConsultorioEspecialidad.create({
            id_usuario:     nuevoUsuario.id_usuario,
            id_consultorio: id_consultorio,
            id_especialidad: id_especialidad
        }, { transaction: t });

        await t.commit();

        res.status(201).json({ ok: true, msg: 'Usuario creado', data: nuevoUsuario });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ ok: false, msg: 'Error al crear usuario', error: error.message });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { id_consultorio, id_especialidad, ...datos } = req.body;

        const [actualizado] = await Usuario.update(datos, {
            where: { id_usuario: id },
            transaction: t
        });

        if (!actualizado) {
            await t.rollback();
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        if (id_consultorio && id_especialidad) {
            await UsuarioConsultorioEspecialidad.upsert({
                id_usuario:      id,
                id_consultorio:  id_consultorio,
                id_especialidad: id_especialidad
            }, { transaction: t });
        }

        await t.commit();

        const usuarioEditado = await Usuario.findByPk(id, {
            include: [
                { model: Horario, attributes: ['nombre', 'horario_inicio', 'horario_fin'] },
                {
                    model: UsuarioConsultorioEspecialidad,
                    as: 'asignaciones',
                    include: [
                        { model: Consultorio,  attributes: ['nombre', 'ciudad'] },
                        { model: Especialidad, attributes: ['nombre'] }
                    ]
                }
            ]
        });

        res.json({ ok: true, msg: 'Usuario actualizado', data: usuarioEditado });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Activar/desactivar usuario
exports.cambiarEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ msg: 'No existe' });
        const nuevoEstado = (usuario.estado === 'activo') ? 'inactivo' : 'activo';
        await usuario.update({ estado: nuevoEstado });
        res.json({
            ok: true,
            msg: `Usuario ahora está ${nuevoEstado}`,
            estado: nuevoEstado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};