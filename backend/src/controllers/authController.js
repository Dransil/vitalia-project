const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login o ingreso
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return res.status(404).json({ ok: false, msg: 'Credenciales incorrectas - Email' });
        }
        if (usuario.estado !== 'activo') {
            return res.status(403).json({ ok: false, msg: 'Cuenta desactivada. Contacte al administrador.' });
        }
        const passwordValida = bcrypt.compareSync(password, usuario.contraseña_hash);
        
        if (!passwordValida) {
            return res.status(401).json({ ok: false, msg: 'Credenciales incorrectas - Password' });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // El token expira en 8 horas
        );

        res.json({
            ok: true,
            msg: 'Bienvenido a Vitalia',
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                rol: usuario.rol
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error en el servidor', error: error.message });
    }
};