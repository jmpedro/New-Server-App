const { request, response } = require('express');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const path = require('path');
const fs = require('fs');
const subirArchivos = require('../helpers/upload-file');
const { Usuario, Producto } = require('../models');

// Subimos el archivo a nuestra carpeta local
const cargarArchivos = async (req = request, res = response) => {
    
    try {
        
        const response = await subirArchivos(req.files, undefined, 'imgs');

        res.json({
            nombreArchivo: response
        });

    } catch (error) {
        
        res.json({ error })

    }

}

// Actualizamos la imagen nueva en la BD
const actualizarImagen = async ( req, res = response ) => {

    const { coleccion, id } = req.params;

    // Comprobamos que el ID exista en su coleccion correspondiente
    let model;

    switch (coleccion) {
        case 'usuarios':
            
            model = await Usuario.findById(id);
            if( !model ) {

                return res.status(400).json({
                    msg: 'Este id no existe en la coleccion ' + coleccion
                });

            }
            break;
        case 'productos':
        
            model = await Producto.findById(id);
            if( !model ) {

                return res.status(400).json({
                    msg: 'Este id no existe en la coleccion ' + coleccion
                });

            }
            break;
    
        default: 

            res.status(500).json({ msg: 'ERROR 500' });
            break;
    }

    // Limpiamos las imagenes previas 
    // Comprobamos que la imagen exista en la BD
    if( model.image ) {

        // Cogemos la ruta de la imagen y la borramos si existe
        const pathImage = path.join(__dirname, '../uploads', coleccion, model.image);
        if( fs.existsSync(pathImage) ) {

            fs.unlinkSync(pathImage);

        }

    }


    const imagen = await subirArchivos(req.files, undefined, coleccion);

    // Subimos la Imagen a la BD
    model.image = imagen;

    await model.save();

    res.json({
        model
    });

}

// Actualizamos la imagen nueva en la BD
const actualizarImagenCloudinary = async ( req, res = response ) => {

    const { coleccion, id } = req.params;

    // Comprobamos que el ID exista en su coleccion correspondiente
    let model;

    switch (coleccion) {
        case 'usuarios':
            
            model = await Usuario.findById(id);
            if( !model ) {

                return res.status(400).json({
                    msg: 'Este id no existe en la coleccion ' + coleccion
                });

            }
            break;
        case 'productos':
        
            model = await Producto.findById(id);
            if( !model ) {

                return res.status(400).json({
                    msg: 'Este id no existe en la coleccion ' + coleccion
                });

            }
            break;
    
        default: 

            res.status(500).json({ msg: 'ERROR 500' });
            break;
    }

    // Limpiamos las imagenes previas 
    // Comprobamos que la imagen exista en la BD
    if( model.image ) {

        const nombreArray = model.image.split('/');
        const nombreImagen = nombreArray[ nombreArray.length -1 ];
        // obtenemos solo el nombre y quitamos la extension
        const [ public_id ] = nombreImagen.split('.');

        // La eliminamos de cloudinary
        cloudinary.uploader.destroy(public_id);

    }

    // Subimos la imagen a Cloudinary
    const { tempFilePath } = req.files.archivo;
    // Obtenemos la url de la imagen
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    // Subimos la Imagen a la BD
    model.image = secure_url;

    await model.save();

    res.json({
        model
    });

}

// Obtener imagen
const obtenerImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    // Comprobamos que el ID exista en su coleccion correspondiente
    let model;

    switch (coleccion) {
        case 'usuarios':
            
            model = await Usuario.findById(id);
            if( !model ) {

                return res.status(400).json({
                    msg: 'Este id no existe en la coleccion ' + coleccion
                });

            }
            break;
        case 'productos':
        
            model = await Producto.findById(id);
            if( !model ) {

                return res.status(400).json({
                    msg: 'Este id no existe en la coleccion ' + coleccion
                });

            }
            break;
    
        default: 

            res.status(500).json({ msg: 'ERROR 500' });
            break;
    }

    // Limpiamos las imagenes previas 
    // Comprobamos que la imagen exista en la BD
    if( model.image ) {

        // Cogemos la ruta de la imagen y la borramos si existe
        const pathImage = path.join(__dirname, '../uploads', coleccion, model.image);
        if( fs.existsSync(pathImage) ) {

            // Devolvemos la imagen
            return res.sendFile(pathImage);

        }

    }

    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
    
    // Enviamos la imagen por defecto
    res.sendFile(pathNoImage);

}

module.exports = { cargarArchivos, actualizarImagenCloudinary, obtenerImagen }