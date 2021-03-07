// Clase de Mensaje
class Mensaje {

    constructor( uid, nombre, mensaje ) {
        
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;

    }

}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    // Obtenemos los 10 ultimos mensajes
    get ultimos10() {

        this.mensajes = this.mensajes.splice(0, 10);

        return this.mensajes;

    }

    // Obtenemos un array de usuarios
    get usuariosArray() {
        
        return Object.values( this.usuarios );

    }

    // Enviamos un mensaje
    enviarMensaje(uid, nombre, mensaje) {

        // El mensaje vamos a ponerlo al principio del array
        this.mensajes.unshift( new Mensaje(
            uid, 
            nombre, 
            mensaje
        ) );

    }

    // Conectar un usuario
    conectarUsuario(usuario) {

        // Añadimos el usuario a la lista de usuarios conectados
        this.usuarios[usuario.id] = usuario;

    }

    // Desconectar un usuario
    desconectarUsuario(id) {

        // Removemos de la lista de usuarios conectados el usuario recibido
        delete this.usuarios[id];

    }

}

module.exports = ChatMensajes;