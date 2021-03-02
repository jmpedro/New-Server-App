
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
        
const { isValidRol, isEmailValid, isValidID } = require('../helpers/db-valdiators');

const { validarCampos, validarJWT, tieneRol } = require('../middlewares/index');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidID),
    check('role').custom(isValidRol),
    validarCampos
], usuariosPut );

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 caráteres').isLength({ min: 6 }),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom( isEmailValid ),
    // check('role', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRol ),
    validarCampos
] ,usuariosPost );

router.delete('/:id', [
    validarJWT,
    // validarRol,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidID),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;