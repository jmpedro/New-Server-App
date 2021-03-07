const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Comenzamos a generar el token del usuario
const generarJWT = (uid = '') => {

    return new Promise( (resolve, reject) => {

        // Obtenemos el payload de su uid
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '4d'}, (err, token) => {

            if( err ) {

                console.log(err);
                reject('No se pudo generar el token');

            }else {

                resolve(token);

            }

        } )

    } )

}

const comprobarJWT = async (token = '') => {

    try {
        
        // Verificamos el token si viene alguno y obtenemos su uid
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // Hacemos las verificaciones necesarias para saber si un usuario esta inactivo aunque recibamos su token
        const usuario = await Usuario.findById(uid);
        
        // Comprobamos que el usuario exista
        if( !usuario ) {

            return null;

        }

        // Comprobamos que el usuario este activo
        if( !usuario.state ) {

            return null

        }

        return usuario;

    } catch (error) {
        
    }

}

module.exports = { generarJWT, comprobarJWT };