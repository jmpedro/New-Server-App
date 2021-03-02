const { Router } = require('express');
const { check } = require('express-validator');
const { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById } = require('../controllers/productos');
const { isValidIdCategory, isValidIdProduct, isValidRol } = require('../helpers/db-valdiators');
const { validarJWT, validarRol } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Obtenemos todos los productos
router.get('/', getAllProducts);

// Obtenemos un producto por su ID
router.get('/:id', [
    check('id', 'El ID de este producto no es válido').isMongoId(),
    check('id').custom(isValidIdProduct),
    validarCampos
], getProductById);

// Creamos un nuevo producto
router.post('/', [
    validarJWT,
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('categoria', 'El ID de categoria no es válido').isMongoId(),
    check('categoria').custom(isValidIdCategory),
    validarCampos
], createProduct);

// Actualizamos un producto
router.put('/:id', [
    validarJWT,
    check('id', 'El ID de este producto no es válido').isMongoId(),
    check('id').custom(isValidIdProduct),
    check('categoria', 'El ID de categoria no es válido').isMongoId(),
], updateProductById);

// Borramos o desactivamos un producto
router.delete('/:id', [
    validarJWT,
    validarRol,
    check('id', 'El ID de este producto no es válido').isMongoId(),
    check('id').custom(isValidIdProduct),
    validarCampos
], deleteProductById);

module.exports = router;