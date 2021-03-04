const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

// Validamos que sea un rol correcto
const isValidRol = async (role = '') => {

    // Comprobamos que el rol sea valido contra la BD
    const existeRole = await Role.findOne({ role });
    if( !existeRole ) {

        throw new Error(`El rol ${role} no existe en la BD`)

    }

}

// Validamos que el email exista
const isEmailValid = async (email = '') => {

    // Validamos que el correo no exista en las BD
    const existeEmail = await Usuario.findOne({ email });
    if( existeEmail ) {

        // El throw new Error es necesario cuando usamos express-validator
        throw new Error('Este email ya existe');

    }

}

// Validamos que el ID exista en la BD
const isValidID = async (id) => {

    const existeID = await Usuario.findById(id);
    if( !existeID ) {

        throw new Error('Este ID no existe en la BD');

    }

}

// Validamos que el ID de la categoria exista
const isValidIdCategory = async (idCat) => {

    const existeIdCat = await Categoria.findById(idCat);

    if( !existeIdCat ) {

        throw new Error('Este ID no existe en categorias')

    };

}

// Validamos que el ID del producto exista
const isValidIdProduct = async (idProd) => {

    const existeIdCProd = await Producto.findById(idProd);

    if( !existeIdCProd ) {

        throw new Error('Este ID no existe en productos');

    };

}

// Validamos que la coleccion que venga para las imagenes sea valida
const coleccionesPermitidas = async ( coleccion = '', colecciones = [] ) => {

    const isValid = colecciones.includes(coleccion);

    if( !isValid ) {

        throw new Error(`Las colecciones permitidas son ${colecciones}`);

    }

    return true;

}

module.exports = {
    isValidRol,
    isEmailValid,
    isValidID,
    isValidIdCategory,
    isValidIdProduct,
    coleccionesPermitidas
};