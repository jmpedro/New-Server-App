const jwt = require('jsonwebtoken');

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

module.exports = { generarJWT };