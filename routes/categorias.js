const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, getCategoryById, getAllCategories, updateCategory, deleteCategory } = require('../controllers/categorias');
const { isValidIdCategory } = require('../helpers/db-valdiators');
const { validarJWT, validarRol } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Obtener todas las categorias
router.get('/', getAllCategories);

// Obtener una categoria por ID
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdCategory),
    validarCampos
], getCategoryById );

// Crear una nueva categoria
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar una categoria
router.put('/:id', [
    validarJWT,
    check('name', 'El name es un campo obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdCategory),
    validarCampos
], updateCategory );

// Desactiva o elimina una categoria
router.delete('/:id', [
    validarJWT,
    validarRol,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isValidIdCategory),
    validarCampos
], deleteCategory );

module.exports = router;