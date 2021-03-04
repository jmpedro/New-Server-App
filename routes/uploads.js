const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos, actualizarImagenCloudinary, obtenerImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-valdiators');
const { validarCampos, validarArchivos } = require('../middlewares');

const router = Router();

// Obtener imagenes
router.get('/:coleccion/:id', [
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], obtenerImagen);

// Creacion de imagenes
router.post('/', validarArchivos, cargarArchivos);

// Actualizacion de imagenes
router.put('/:coleccion/:id', [
    validarArchivos,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);

module.exports = router;