const { Usuario, Especialidad, Consultorio } = require('../models/associations');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [
                { model: Especialidad, attributes: ['nombre'] },
                { model: Consultorio, attributes: ['nombre', 'ciudad'] }
            ],
            attributes: ['id_usuario', 'nombre', 'apellido', 'email', 'rol', 'estado', 'telefono', 'dias_atencion']
        });

        if (usuarios.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron usuarios'
            });
        }

        res.json({
            ok: true,
            msg: 'Usuarios obtenidos con éxito',
            data: usuarios
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener usuarios',
            error: error.message
        });
    }
};
// Crear usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { contraseña_hash, ...datos } = req.body;

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const passwordEncriptada = bcrypt.hashSync(contraseña_hash, salt);

        const nuevoUsuario = await Usuario.create({
            ...datos,
            contraseña_hash: passwordEncriptada
        });

        res.status(201).json({ ok: true, msg: 'Usuario creado', data: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al crear', error: error.message });
    }
};