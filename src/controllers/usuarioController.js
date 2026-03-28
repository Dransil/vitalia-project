const { Usuario, Especialidad, Consultorio } = require('../models/associations');

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