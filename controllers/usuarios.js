const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query).skip( Number(desde) ).limit( Number(limite) )
    ]);
    

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    // Guardamos la informacion del usuario
    const usuario = new Usuario( {
        name, 
        email, 
        password, 
        role
    } );

    // Enciptamos la contraseña
    const salt = bcryptjs.genSaltSync(); // si dejamos por defecto el genSaltSync() esta indicando que va a dar 10 vueltas
    usuario.password = bcryptjs.hashSync(password, salt);

    // Realizamos la isercion del usuario en la BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    // Obtenemos las propiedades que queremos actualizar y las que queremos ocultar
    const { _id, password, google, email, ...resto } = req.body;

    // Si viene la contraseña la encriptamos
    if( password ) {

        const salt = bcryptjs.genSaltSync(); // si dejamos por defecto el genSaltSync() esta indicando que va a dar 10 vueltas
        resto.password = bcryptjs.hashSync(password, salt);

    }

    // Guardamos el usuario y lo actualizamos
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true, runValidators: true });

    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    let { id } = req.params;

    // Desactivamos al usuario para que no este disponble en nuestra BD
    const usuario = await Usuario.findByIdAndUpdate(id, { state: false }, { new: true, runValidators: true });

    res.json({
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}