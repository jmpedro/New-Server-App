const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin, renovarToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

// Para hacer el login
router.post('/login', [
    check('email', 'El email no es válido').isEmail(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

// Loggearse con google
router.post('/google', [
    check('id_token', 'Es necesario un ID_TOKEN').not().isEmpty(),
    validarCampos
], googleSignin);

// Validar Login 
router.get('/', validarJWT, renovarToken );

module.exports = router;