
const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const tieneRol = require('../middlewares/validar-rol');
const validarArchivos = require('./validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...tieneRol,
    ...validarArchivos
}