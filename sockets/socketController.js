const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io ) => {

    const usuarioSocket = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !usuarioSocket ) {

        return socket.disconnect();

    }

    // Agregamos el usuario conectado
    chatMensajes.conectarUsuario(usuarioSocket);
    // Enviamos un mensaje a todos indicando quien se ha conectado
    io.emit('usuarios-activos', chatMensajes.usuariosArray);
    // Obtenemos los 10 ultimos mensajes cuando el usuario se conecte para que pueda verlos
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Creamos una sala para los mensajes privados con el uid del usuario
    socket.join( usuarioSocket.id );

    // Usuario desconectado
    socket.on('disconnect', () => {

        chatMensajes.desconectarUsuario(usuarioSocket.id);

        // Enviamos un mensaje a todos indicando quien se ha desconectado
        io.emit('usuarios-activos', chatMensajes.usuariosArray);

    })

    // Escuchamos el mensaje del socket
    socket.on('enviar-mensaje', ({ mensaje, uid }) => {

        if( uid ) {
            
            socket.to(uid).emit('mensaje-privado', { de: usuarioSocket.name, mensaje });

        }else {

            // Guardamos el mensaje
            chatMensajes.enviarMensaje( usuarioSocket.id, usuarioSocket.name, mensaje );

            // Enviamos el mensaje de vuelta al socket
            io.emit('recibir-mensajes', chatMensajes.ultimos10);


        }
        
    })

}

module.exports = {
    socketController
}