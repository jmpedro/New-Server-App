const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['categorias', 'usuarios', 'productos'];

// Configuramos la busqueda de usuario/os
const buscarUsuarios = async (termino = '', res = response) => {

    // Comprobamos que si el termino es un ID valido de Mongo
    const validIDMongo = ObjectId.isValid(termino);

    // Si el ID es valido, buscamos el usuario en la BD
    if( validIDMongo ) { 

        const usuario = await Usuario.findById(termino);

        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });

    }

    // Controlamos que busque por nombre y correo
    const regex = new RegExp(termino, 'i'); // La i es para indicar que sea insensible a minusculas y mayusculas

    /*
        $or => Significa que se debe cumplir una condicion u otra
        $and => significa que se debe cumplir esa condicion
    */
    const usuarios = await Usuario.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state:  true }]
    });

    res.json({
        results: usuarios
    });

}

// Configuramos la busqueda de categorias
const buscarCategorias = async ( termino = '', res = response ) => {

    // Comprobamos que el ID de categoria sea valido
    const validIDMongo = ObjectId.isValid(termino);
    
    if( validIDMongo ) { 

        const categoria = await Categoria.findById(termino);

        return res.json({
            results: (categoria) ? [categoria] : []
        });

    }

    // Creamos el regex par la busqueda
    const regex = new RegExp(termino, 'i');

    // Realizamos la busqueda
    const categorias = await Categoria.find({ name: regex, state: true });

    res.json({
        results: categorias
    });

}

// Configuramos la busqueda de categorias
const buscarProductos = async ( termino = '', res = response ) => {

    // Comprobamos que el ID de productos sea valido
    const validIDMongo = ObjectId.isValid(termino);
    
    if( validIDMongo ) { 

        const categoria = await Producto.findById(termino).populate('categorias', 'name');

        return res.json({
            results: (categoria) ? [categoria] : []
        });

    }

    // Creamos el regex par la busqueda
    const regex = new RegExp(termino, 'i');

    // Realizamos la busqueda
    const productos = await Producto.find({ name: regex, state: true }).populate('categorias', 'name');

    res.json({
        results: productos
    });

}

const buscar = async ( req = request, res = response ) => {

    // Obtenemos la coleccion a buscar y el termino
    const { coleccion, termino } = req.params;

    // Comprobamos que la coleccion recibida sea valida
    if( !coleccionesPermitidas.includes(coleccion) ) {

        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });

    }

    // Si son validas, hacemos un switch para controlar todos los casos
    switch (coleccion) {
        case 'usuarios':
            await buscarUsuarios(termino, res);
            break;
        case 'categorias':
            await buscarCategorias(termino, res);
            break;
        case 'productos':
            await buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se te olvido realizar esta busqueda'
            })
            break;
    }

}

module.exports = { buscar };