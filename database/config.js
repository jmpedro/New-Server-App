const mongoose = require('mongoose');

// Iniciamos la conexion a la BD
const dbConnection = async() => {

    try {
        
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online');

    } catch (error) {
        
        console.log(error);
        throw new 'Error al iniciar en la base de datos';

    }

}

module.exports = dbConnection;