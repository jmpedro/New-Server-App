const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// VALIDACION DEL TOKEN
const validarJWT = async (req = request, res = response, next) => {

    // Obtenemos el token del header
    const token = req.get('x-token');
    
    if( !token ) {

        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });

    }else {

        try {

            // Verificamos el token si viene alguno y obtenemos su uid
            const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

            // Hacemos las verificaciones necesarias para saber si un usuario esta inactivo aunque recibamos su token
            const usuario = await Usuario.findById(uid);
            
            // Comprobamos que el usuario exista
            if( !usuario ) {

                return res.status(401).json({
                    msg: 'Token no válido | usuario'
                })

            }

            // Comprobamos que el usuario este activo
            if( !usuario.state ) {

                return res.status(401).json({
                    msg: 'Token no válido | Usuario inactivo'
                })

            }

            req.usuario = usuario;

            next();

        } catch (error) {
            
            console.log(error);
            res.status(401).json({
                msg: 'Token no válido'
            });

        }

    }

}

module.exports = { validarJWT }