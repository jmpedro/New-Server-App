const { response } = require("express");

const validarRol = (req, res = response, next) => {

    // Si no viene ningun usuario por request lanzamos error
    if( !req.usuario ) {

        return res.status(500).json({
            msg: 'ERROR | Se quiere verificar el rol antes de validar el token'
        });

    }

    // obtenemos el rol desde el parametro usuario
    const { role } = req.usuario;

    if( role !== 'ADMIN_ROLE' ) {

        return res.status(401).json({
            msg: 'Solo los adminsitradores pueden realizar esta acción'
        });

    }

    // Si se cumplen todos los requisitos, seguimos
    next();

}

// Validamos que los roles que recibamos son correctos
const tieneRol = ( ...roles ) => {

    return ( req, res = response, next ) => {

        if( !req.usuario ) {

            return res.status(500).json({
                msg: 'ERROR | Se requiere verificar el rol antes de validar el token'
            });

        }

        if( !roles.includes(req.usuario.role) ) {

            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`
            });

        }

        next();

    }

}

module.exports = {validarRol, tieneRol};