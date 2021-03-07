const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    // Verificamos que el email exista
    const usuario = await Usuario.findOne({ email });
    if( !usuario ) {

        return res.status(500).json({
            msg: 'El email o el password son incorrectos | email'
        });

    }

    // Verificamos que el usuario esté activo
    if( !usuario.state ) {

        return res.status(500).json({
            msg: 'El email o el password son incorrectos | state'
        });

    }

    // Verificamos que la contraseña sea la correcta
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if( !validPassword ) {

        return res.status(500).json({
            msg: 'El email o el password son incorrectos | password'
        });

    }

    // Generamos el token
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });

}

const googleSignin = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { name, email, image } = await googleVerify(id_token);

        // Si el usuario no existe, lo guardamos en la BD con las credenciales de Google
        const usuario = await Usuario.findOne({ email });

        if( !usuario ) { 

            const data = {
                name,
                email,
                password: ':P',
                image,
                google: true
            },

            usuario = new Usuario( data );

            await usuario.save();

        }

        // Si el usuario está bloqueado no se permite entrar
        if( !usuario.state ) {

            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });

        }

        // Generamos el token del usuario
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        
        res.status(400).json({
            error
        });

    }

}

const renovarToken = async (req, res = response) => {

    const { usuario } = req;

    // Generamos el token del usuario
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });

}

module.exports = {
    login,
    googleSignin,
    renovarToken
}