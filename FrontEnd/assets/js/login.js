/***********************
/*        DOM
/**********************/
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const userConnected = sessionStorage.getItem('token');

const editModeElements = document.querySelectorAll('.edit');
const loginElement = document.querySelector('.login');

/***********************
/*       Variables
/**********************/
let user = {
	email: '',
	password: '',
};

let editMode = false;

/***********************
/*     Functions
/**********************/
function getEmailValue() {
	user.email = emailInput.value;
}

function getPasswordValue() {
	user.password = passwordInput.value;
}

async function postLogin() {
	const response = await fetch('http://localhost:5678/api/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(user),
	});

	let data = await response.json();

	if (response.ok) {
		sessionStorage.setItem('token', data.token);
		window.location.assign('../../index.html');
	} else {
		const loginError = document.querySelector('form .error');

		loginError.textContent = "Erreur dans l'identifiant ou le mot de passe";
		loginError.style.margin = '15px 0 0 0';
	}
}

function loginUser() {
	const form = document.querySelector('form');

	form.addEventListener('submit', async (event) => {
		event.preventDefault(); // Annulation du refresh de la page

		getEmailValue();
		getPasswordValue();

		await postLogin();
	});
}

function logoutUser() {
	const logoutElement = document.querySelector('.logout');

	logoutElement.addEventListener('click', () => {
		sessionStorage.removeItem('token');
		window.location.reload();
		setEditMode();
		toggleEditMode();
	});
}

function setEditMode() {
	if (userConnected) {
		editMode = true;
	} else {
		editMode = false;
	}
}

function toggleEditMode() {
	setEditMode();

	if (editMode) {
		editModeElements.forEach((element) => {
			element.style.display = 'flex';
		});
		loginElement.style.display = 'none';
	} else {
		editModeElements.forEach((element) => {
			element.style.display = 'none';
		});
		loginElement.style.display = 'flex';
	}
}

loginUser();
toggleEditMode();
logoutUser();
