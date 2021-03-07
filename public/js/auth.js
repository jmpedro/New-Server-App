
const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost')) && 'http://localhost:3030/api/auth/';

// LOGIN MANUAL
miFormulario.addEventListener('submit', ev => {

    // Prevenimos el evento para evitar que se recargue la pagina
    ev.preventDefault();

    const formData = {};

    // Recorreomos los elementos del formulario y obtenemos su valor
    for( let el of miFormulario.elements ) {

        if( el.name.length > 0 ) {

            formData[el.name] = el.value;

        }

    }

    // Hacemos el fetch post al backend y cuando obtengamos el token, lo guardamos en el localStorage
    fetch( url + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    } ).then( response => response.json() ).then( ({ msg, token }) => {

        if( msg ) {
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';

    } ).catch(err => {
        console.log(err);
    })

})

// LOGIN CON GOOGLE
function onSignIn(googleUser) {

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    // Hacemos el post al backend para guardar el token de google
    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    } ).then( response => response.json() )
        .then( ({ token }) => {

            localStorage.setItem('token', token);
            window.location = 'chat.html';

        } )
        .catch( console.log );

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}
