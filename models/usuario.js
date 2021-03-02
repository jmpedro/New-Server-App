const { Schema, model } = require('mongoose');


// Creamos el modelo de usuario
const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

// Cuando devolvamos este objeto en formato JSON, podremos quitar los campos que queramos para que no se muestren con lo siguiente:
UsuarioSchema.methods.toJSON = function() {

    // Indicamos las propiedades que no queremos que se muestren
    // El ultimo parametro(...usuario) es el objeto donde se van a guardar el resto de propiedades
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;

    return usuario;

}

module.exports = model('Usuario', UsuarioSchema);