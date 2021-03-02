const { response, request } = require('express');
const { Producto } = require('../models');

// Obtenemos todos los productos
const getAllProducts = async (req = request, res = response) => {

    const { desde = 0, limite = 5 } = req.query;
    const query = { state : true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).skip( Number(desde) ).limit( Number(limite) ).populate('categoria', 'name')
    ]);

    res.json({
        total,
        productos
    });

}

// Obtenemos un producto por su ID
const getProductById = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id);

    res.json({
        producto
    });

}

// Creamos un nuevo producto
const createProduct = async (req = request, res = response) => {

    const { state, usuario, ...data } = req.body;

    if( data.name ) {

        data.name = data.name.toUpperCase();

    }

    const productoDB = await Producto.findOne({ name: data.name });

    if( productoDB ) {

        return res.status(400).json({
            msg: 'Este producto ya existe'
        });

    }

    const producto = new Producto({
        usuario: req.usuario._id,
        ...data
    });

    await producto.save();

    res.status(201).json({
        producto
    });

}

// Actualizamos un producto por su ID
const updateProductById = async (req = request, res = response) => {

    const { id } = req.params;
    const { state, usuario, ...data } = req.body;

    // Si viene el nombre lo actualizamos 
    if( data.name ) {

        data.name = data.name.toUpperCase();

    }

    // Actualizamos el usuario al obtenerlo a traves del token en el header
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        producto
    });

}

// Eliminamos o desactivamos un producto por su ID
const deleteProductById = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        producto
    });

}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
}

