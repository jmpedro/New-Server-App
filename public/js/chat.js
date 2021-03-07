
const url = (window.location.hostname.includes('localhost')) && 'http://localhost:3030/api/auth/';

let usuario = null;
let socket = null;

// Referencias de HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


const validarJWT = async () => {

    // Obtenemos el token del localStorage
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {

        window.location = 'index.html';
        throw new Error('No hay token en el servidor');

    }

    // Hacemos el fetch al servidor con el token del header
    const response = await fetch( url, {
        headers: { 'x-token': token }
    } );

    // Obtenemos el token y el usuario de la respuesta
    const { usuario: userDB, token: tokenDB } = await response.json();

    // Renovamos el token otra vez
    localStorage.setItem('token', tokenDB);
    // Guardamso el usuarioDB en nuestra variable
    usuario = userDB;
    document.title = usuario.name;

    await conectarSocket();

}

// Funcion para pasarle el token al socket
const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    // Funciones a realizar por el socket
    socket.on('connect', () => {
        
        console.log('Sockets online');

    });

    socket.on('disconnect', () => {
        
        console.log('Sockets offline');

    });

    socket.on('recibir-mensajes', renderizarMensajes);

    socket.on('usuarios-activos', renderizarUsuarios );

    socket.on('mensaje-privado', (payload) => {
        
        console.log(payload);

    });


}

// Renderizamos los mensajes
const renderizarMensajes = (mensajes = []) => {

    let mensajesHtml = '';

    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHtml += `
            <li>

                <p>
                
                    <h5 class="text-primary" > ${nombre} </h5>
                    <span> ${mensaje} </span>
                
                </p>

            </li>
        
        `

    } );

    ulMensajes.innerHTML = mensajesHtml;

}

// Renderizamos los usuarios
const renderizarUsuarios = (usuarios = []) => {

    let usersHtml = '';

    usuarios.forEach( ({ name, uid }) => {

        usersHtml += `
            <li>

                <p>
                
                    <h5 class="text-success" > ${name} </h5>
                    <span class="fs-6 text-muted" > ${uid} </span>
                
                </p>

            </li>
        
        `

    } );

    ulUsuarios.innerHTML = usersHtml;

}

// Enviar mensaje por sockets
txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    // Obtenemos el mensaje
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    // El codigo 13 es la tecla Enter
    if( keyCode !== 13 ) {
        return;
    }

    // Si el mensaje viene vacío no hacemos nada
    if( !mensaje ) return;

    // Enviamos el mensaje al socket
    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';

});

// Salir
btnSalir.addEventListener('click', () => {

    localStorage.removeItem('token');

    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then( () => {
        console.log('User signed out.');
        window.location = 'index.html';
    });

})

const main = async () => {

    await validarJWT();

}

(()=>{
    gapi.load('auth2', () => {
        gapi.auth2.init();
        main();
    });
})();
