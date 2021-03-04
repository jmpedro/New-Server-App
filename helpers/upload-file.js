const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Funcion para subir cualquier archivo a la carpeta que le indiquemos con sus validaciones correspondientes
const subirArchivos = (files, validExtension = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise( (resolve, reject) => {

        // Obtenemos el archivo del request
        const { archivo } = files;

        const nombreArchivo = archivo.name.split('.');
        const extensionArchivo = nombreArchivo[ nombreArchivo.length - 1 ];

        // Validamos la extension
        if( !validExtension.includes(extensionArchivo) ) {

            return reject('Esta extension no está permitida');

        }

        // Generamos un nuevo nombre del archivo par guardarlo en la BD
        const archivoTemp = uuidv4() + '.' + extensionArchivo;
        
        // Creamos la ruta donde se va a guardar
        const uploadPath = path.join(__dirname,'../uploads/', carpeta, archivoTemp);

        // Movemos el arhcivo a la ruta especificada
        archivo.mv(uploadPath, (err) => {

            if (err) {
                reject(err);
            }

            resolve(archivoTemp)

        });

    } )

}

module.exports = subirArchivos