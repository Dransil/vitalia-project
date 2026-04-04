const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ← IMPORTANTE: Importar bcrypt

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validar que los campos no estén vacíos
        if (!email || !password) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'Email y contraseña son requeridos' 
            });
        }
        
        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });
        
        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Credenciales incorrectas' 
            });
        }
        
        // Verificar si el usuario está activo
        if (usuario.estado !== 'activo') {
            return res.status(403).json({ 
                ok: false, 
                msg: 'Cuenta desactivada. Contacte al administrador.' 
            });
        }
        
        const passwordValida = await bcrypt.compare(password, usuario.contraseña_hash);
        
        if (!passwordValida) {
            return res.status(401).json({ 
                ok: false, 
                msg: 'Credenciales incorrectas' 
            });
        }
        
        // Generar Token JWT
        const token = jwt.sign(
            { 
                id: usuario.id_usuario, 
                email: usuario.email,
                rol: usuario.rol 
            },
            process.env.JWT_SECRET || 'secreto-temporal-para-desarrollo',
            { expiresIn: '8h' }
        );
        
        // Responder con éxito
        res.json({
            ok: true,
            msg: 'Bienvenido a Vitalia',
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            },
            token
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            ok: false, 
            msg: 'Error en el servidor', 
            error: error.message 
        });
    }
};