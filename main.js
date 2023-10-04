const storedUsers = localStorage.getItem('userList');
const userList = storedUsers ? JSON.parse(storedUsers) : [];
const storedTweets = localStorage.getItem('tweets');
const tweets = storedTweets ? JSON.parse(storedTweets) : [];


class Usuario {
    constructor(nombreUsuario, contrasena, fotoPerfil = '', biografia = '') {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.fotoPerfil = fotoPerfil;
        this.biografia = biografia;
    }
}


// Obtener elementos del DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');

function findUserByUsername(username) {
    return userList.find(user => user.nombreUsuario === username);
}


loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = findUserByUsername(username);

    if (user && user.contrasena === password) {
        loginError.textContent = '';  

        showAuthenticatedSection(username);  
    } else {
        loginError.textContent = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
    }
});

// Obtener el botón de "Registrarse"
const showRegisterButton = document.getElementById('show-register-button');

// Obtener el contenedor del formulario de registro
const registerContainer = document.getElementById('register-container');

// Obtener el contenedor de la sección autenticada
const authenticatedSection = document.getElementById('authenticated-section');

// Obtener el contenedor del perfil de usuario
const userProfile = document.getElementById('user-profile');

// Obtener el elemento de visualización del nombre de usuario
const usernameDisplay = document.getElementById('username-display');

// Obtener el botón de "Cerrar Sesión"
const logoutButton = document.getElementById('logout-button');

// Obtener el elemento de visualización de la foto de perfil
const profileImage = document.getElementById('profile-image');

// Obtener el elemento de visualización de la biografía (ahora es un párrafo)
const biographyParagraph = document.getElementById('biography-paragraph');

// Obtener el botón para actualizar la foto y la biografía
const updateProfileButton = document.getElementById('update-profile-button');

// Obtener elementos del DOM para los tweets
const tweetContainer = document.getElementById('tweet-container');
const tweetForm = document.getElementById('tweet-form');
const tweetInput = document.getElementById('tweet-input');


showRegisterButton.addEventListener('click', function () {
    
    const loginContainer = document.getElementById('login-container');
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
    showRegisterButton.style.display = 'none';
});

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    if (newUsername && newPassword) {
        if (findUserByUsername(newUsername)) {
            registerError.textContent = 'Este usuario ya existe. Por favor, elige otro nombre de usuario.';
        } else {
            const newUser = new Usuario(
                newUsername,
                newPassword,
                'https://img.freepik.com/vector-premium/icono-avatar-masculino-persona-desconocida-o-anonima-icono-perfil-avatar-predeterminado-usuario-redes-sociales-hombre-negocios-silueta-perfil-hombre-aislado-sobre-fondo-blanco-ilustracion-vectorial_735449-120.jpg',
                '¡Hola! Esta es mi biografía '
            );

            userList.push(newUser);

            saveToLocalStorage(userList);

            registerError.textContent = '';  
            registerSuccess.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';

            const loginContainer = document.getElementById('login-container');
            loginContainer.style.display = 'block';

            
            registerContainer.style.display = 'none';
            
            showRegisterButton.style.display = 'none';
        }
    } else {
        registerError.textContent = 'Completa todos los campos para registrarte.';
        registerSuccess.textContent = '';  
    }
});


function saveToLocalStorage(users) {
    localStorage.setItem('userList', JSON.stringify(users));
}

function showAuthenticatedSection(username) {
    const loginContainer = document.getElementById('login-container');
    loginContainer.style.display = 'none';

    authenticatedSection.style.display = 'block';

    showRegisterButton.style.display = 'none';

    userProfile.style.display = 'block';

    usernameDisplay.textContent =  username;

    const user = findUserByUsername(username);
    updateProfileDisplay(user);
}

function loadTweetsFromLocalStorage() {
   r
    tweetContainer.innerHTML = '';

    tweets.forEach(tweet => {
        addTweetToContainer(tweet.message, tweet.username);
    });
}

loadTweetsFromLocalStorage(); 

function addTweetToContainer(message, username) {
    const tweetCard = document.createElement('div');
    tweetCard.classList.add('tweet-card');

    const tweetContent = document.createElement('p');
    tweetContent.textContent = `${username}: ${message}`;

    tweetCard.appendChild(tweetContent);

    tweetContainer.appendChild(tweetCard);
}

function addTweet(message, username) {
    addTweetToContainer(message, username);

    
    const existingTweets = tweets.filter(tweet => tweet.message !== message || tweet.username !== username);
    tweets.length = 0; 
    tweets.push(...existingTweets, { message, username });

    saveTweetsToLocalStorage();
}

function saveTweetsToLocalStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}


tweetForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value; 
    const message = tweetInput.value;

    if (message) {
        addTweet(message, username);
        tweetInput.value = ''; 
    }
});

logoutButton.addEventListener('click', function () {

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';


    authenticatedSection.style.display = 'none';
    userProfile.style.display = 'none';

  
    const loginContainer = document.getElementById('login-container');
    loginContainer.style.display = 'block';

    
    showRegisterButton.style.display = 'block';
});

function updateProfileDisplay(user) {

    profileImage.src = user.fotoPerfil;


    biographyParagraph.textContent = 'Biografía: ' + user.biografia;


    saveToLocalStorage(userList);
}

updateProfileButton.addEventListener('click', function () {
   
    const username = document.getElementById('username').value;
    const user = findUserByUsername(username);


    user.fotoPerfil = prompt('Ingrese la URL de la nueva foto de perfil:', user.fotoPerfil);
    user.biografia = prompt('Ingrese la nueva biografía:', user.biografia);

   
    updateProfileDisplay(user);
});

localStorage.removeItem(tweets)