/***********************
/*       DOM
/**********************/
const publishChangeButton = document.querySelector('.edit__banner__btn');
const modal = document.getElementById('modal');
const modalCloseButton = modal.querySelector('.modal__close__btn');
const modalOpenLinks = document.querySelectorAll('.open__modal');
const modalGallery = modal.querySelector('.modal__gallery');
const modalOne = modal.querySelector('.modal__1');
const modalTwo = modal.querySelector('.modal__2');
const addPicturesButton = modalOne.querySelector('.add__pictures__btn');
const deleteGallery = document.querySelector('.delete__gallery');
const arrowButton = modalTwo.querySelector('.modal__arrow__btn');
const modalForm = document.getElementById('add__works');
const imageContainer = document.getElementById('image__container');
const previewIcon = modalTwo.querySelector('.preview__icon');
const addImageButton = modalTwo.querySelector('.add__image__btn');
const imageInput = document.getElementById('image');
const imageSize = modalTwo.querySelector('.image__maxsize');
const imagePreview = modalTwo.querySelector('.img__preview');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const validateButton = document.getElementById('validate');
const addWorksError = document.querySelector('form .error');
const addWorksSuccess = document.querySelector('form .success');

/***********************
/*         Variables
/**********************/
let isModalOne = true;
let itemID = '';
let currentFile = '';

/***********************
/*       Functions
/**********************/
// Opens the modal and initializes its content
function openModal(e) {
	e.preventDefault();
	modal.style.display = 'flex';
	modalCloseButton.addEventListener('click', closeModal);
	modal.addEventListener('click', closeModal);
	modal
		.querySelector('.modal__wrapper')
		.addEventListener('click', stopPropagation);

	getWorks();
	getCategories();
	displayGalleryInModal(displayedWorks);
	initModal();
	selectCategory(categories);
	renderForm();
}

// Closes the modal
function closeModal(e) {
	e.preventDefault();
	modal.style.display = 'none';
	resetPreviewImage();
	resetInputFields();
	resetFormRendering();
}

function stopPropagation(e) {
	e.stopPropagation();
}

function displayGalleryInModal(data) {
	modalGallery.innerHTML = '';

	data.forEach((item) => {
		let galleryItem = document.createElement('figure');
		let galleryItemImage = document.createElement('img');
		let galleryIconContainer = document.createElement('div');
		let galleryArrowIcon = document.createElement('i');
		galleryArrowIcon.className = 'fa-solid fa-arrows-up-down-left-right';
		let galleryTrashIcon = document.createElement('i');
		galleryTrashIcon.className = 'fa-solid fa-trash-can';
		let galleryItemTitle = document.createElement('figcaption');

		galleryItemImage.src = item.imageUrl;
		galleryItemImage.alt = item.title;
		galleryItemTitle.textContent = 'éditer';

		galleryItem.appendChild(galleryIconContainer);
		galleryIconContainer.appendChild(galleryArrowIcon);
		galleryIconContainer.appendChild(galleryTrashIcon);
		galleryItem.appendChild(galleryItemImage);
		galleryItem.appendChild(galleryItemTitle);
		modalGallery.appendChild(galleryItem);

		galleryTrashIcon.addEventListener('click', async () => {
			itemID = item.id;

			await deleteWorks(itemID);
			galleryItem.remove();
			getWorks();
		});

		deleteGallery.addEventListener('click', async () => {
			itemID = item.id;

			await deleteWorks(itemID);
			galleryItem.remove();
			getWorks();
		});
	});
}

function initModal() {
	modalOne.style.display = 'block';
	modalTwo.style.display = 'none';
}

async function deleteWorks(id) {
	const bearer = sessionStorage.getItem('token');
	await fetch(`http://localhost:5678/api/works/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${bearer}`,
		},
	});
}

// Updates the preview image when an image is selected
function updatePreviewImage(e) {
	currentFile = e.target.files[0];

	if (currentFile) {
		imagePreview.src = URL.createObjectURL(currentFile);
		imagePreview.style.display = 'block';
		previewIcon.style.display = 'none';
		addImageButton.style.display = 'none';
		imageSize.style.display = 'none';
		e.target.value = '';
	}
}

function resetPreviewImage() {
	imagePreview.src = '';
	URL.revokeObjectURL(imagePreview.src);
	imagePreview.style.display = 'none';
	previewIcon.style.display = 'block';
	addImageButton.style.display = 'block';
	imageSize.style.display = 'block';
}

// Renders category options in the modal
function selectCategory(data) {
	categoryInput.innerHTML = '';

	data.forEach((option) => {
		let categoryElement = document.createElement('option');
		categoryElement.value = option.id;
		categoryElement.textContent = option.name;
		categoryInput.appendChild(categoryElement);
	});
}

function resetInputFields() {
	imageInput.value = '';
	titleInput.value = '';
}

function renderForm() {
	addWorksError.textContent = 'Veuillez renseigner tous les champs';
	modalForm.addEventListener('change', () => {
		if (currentFile.name !== undefined && titleInput.value !== '') {
			validateButton.style.background = '#1D6154';
			addWorksError.style.display = 'none';
		} else {
			validateButton.style.background = null;
			addWorksError.style.display = 'flex';
		}
	});
}

function resetFormRendering() {
	validateButton.style.background = null;
	addWorksSuccess.style.display = 'none';
	addWorksError.style.display = 'flex';
}

// Sends new works data to the server
async function sendWorks() {
	const bearer = sessionStorage.getItem('token');

	const formData = new FormData();
	formData.append('image', currentFile);
	formData.append('title', titleInput.value);
	formData.append('category', categoryInput.value);

	const response = await fetch(`http://localhost:5678/api/works`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${bearer}`,
		},
		body: formData,
	});

	if (response.ok) {
		addWorksSuccess.style.display = 'flex';
		addWorksSuccess.textContent = 'Ajout du projet réalisé avec succès';
		getWorks();
	} else {
		addWorksSuccess.style.display = 'none';
	}
}

/***********************
/*       EventListeners
/**********************/
modalOpenLinks.forEach((link) => {
	link.addEventListener('click', openModal);
});

addPicturesButton.addEventListener('click', () => {
	isModalOne = false;
	modalOne.style.display = 'none';
	modalTwo.style.display = 'block';
});

arrowButton.addEventListener('click', () => {
	isModalOne = true;
	modalOne.style.display = 'block';
	modalTwo.style.display = 'none';
	resetPreviewImage();
	resetInputFields();
	resetFormRendering();
});

addImageButton.addEventListener('click', () => {
	imageInput.click();
});

imageInput.addEventListener('change', updatePreviewImage);

validateButton.addEventListener('click', sendWorks);

// publishChangeButton.addEventListener('click', getWorks);
