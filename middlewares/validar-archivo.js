const { response } = require('express');

// Funcion para validar si vienen archivos 
const validarArchivos = ( req, res = response, next ) => {

    // Si no viene el parametro archivo o no hay nada seleccionado, enviamos un error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {

        return res.status(400).json({msg: 'No hay ningun archivo seleccionado'});

    }

    next();

}

module.exports = {validarArchivos};