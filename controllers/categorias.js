const { response, request } = require('express');
const { Categoria } = require('../models');

// Obtenemos todas las categorias
const getAllCategories = async ( req = request, res = response ) => {

    const { desde = 0, limite = 5 } = req.query;
    const query = { state: true };

    // Realizamos todas las peticiones
    const [ total, categorias ] = await Promise.all([
        Categoria.count(query),
        Categoria.find(query).skip( Number(desde) ).limit( Number(limite) ).populate('usuario', 'name email')
    ])

    res.json({
        total, 
        categorias
    })

}

// Obtenemos una categoria por su ID
const getCategoryById = async (req = request, res = response) => {

    // Obtenemos el ID
    const { id } = req.params;

    const categoriaDB = await Categoria.findById(id).populate('usuario', 'name email');

    if( !categoriaDB ) {

        return res.status(400).json({
            msg: `La categoria ${categoriaDB.name} no existe`
        })

    }

    res.json({
        categoriaDB
    })

}

// Creamos nueva categoria
const crearCategoria = async (req = request, res = response) => {

    // Lo guardamos como mayuscula para luego en la BD no haya ninguno igual
    const name = req.body.name.toUpperCase();

    // Buscamos en la categoria si existe alguna con este nombre
    const categoriaDB = await Categoria.findOne({ name });

    // Si existe la categoria, lanzamos un error
    if( categoriaDB ) {

        return res.status(400).json({
            msg: `La categoria ${categoriaDB.name} ya existe`
        });

    }

    const data = {
        name,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardamos en la BD
    await categoria.save();

    return res.status(201).json({
        categoria
    });

}

// Actualizar categoria por ID
const updateCategory = async ( req = request, res = response ) => {

    const { id } = req.params;

    // Obtenemos los campos que queremos actualizar y los que nos se van a pasar
    const { state, usuario, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data,  { new: true });

    res.json({
        categoria
    });

}

// Desactivar una categoria
const deleteCategory = async (req = request, res = response) => {

    const { id } = req.params;

    const stateDismiss = { state: false };

    const categoria = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true });

    if( !categoria ) { 

        return res.status(400).json({
            msg: `La categoria ${categoria.name} no existe`
        })

    }

    res.json({
        categoria
    });

}

module.exports = { getAllCategories, getCategoryById, crearCategoria, updateCategory, deleteCategory };

