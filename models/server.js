const express = require('express');
const cors = require('cors');
const dbConnection = require('../database/config');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketController } = require('../sockets/socketController');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        
        // Servidor Socket
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos'
        }

        // Conectar a la BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();

    }

    // Ejecutamos la conexion a la BD
    async conectarDB() {

        await dbConnection();

    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.uploads, require('../routes/uploads') );
        this.app.use( this.paths.buscar, require('../routes/buscar') );
        this.app.use( this.paths.categorias, require('../routes/categorias') );
        this.app.use( this.paths.productos, require('../routes/productos') );
    }

    sockets() {

        this.io.on('connection', (socket) => socketController(socket, this.io) );

    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
