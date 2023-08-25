/***********************
/*       DOM
/**********************/
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

/***********************
/*         Variables
/**********************/
let isModalOne = true;
let itemID = '';
let currentFile = '';

/***********************
/*       Functions
/**********************/
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
	validateForm();
}

function closeModal(e) {
	e.preventDefault();
	modal.style.display = 'none';
	resetPreview();
	resetInputFields();
	resetFormValidation();
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

function updatePreview(e) {
	currentFile = e.target.files[0];

	console.log('File input changed:', e.target.files[0]);

	if (currentFile) {
		imagePreview.src = URL.createObjectURL(currentFile);
		imagePreview.style.display = 'block';
		previewIcon.style.display = 'none';
		addImageButton.style.display = 'none';
		imageSize.style.display = 'none';
		e.target.value = '';
	}
}

function resetPreview() {
	imagePreview.src = '';
	URL.revokeObjectURL(imagePreview.src);
	imagePreview.style.display = 'none';
	previewIcon.style.display = 'block';
	addImageButton.style.display = 'block';
	imageSize.style.display = 'block';
}

function selectCategory(data) {
	categoryInput.innerHTML = '';

	data.forEach((option) => {
		let categoryElement = document.createElement('option');
		categoryElement.value = option.name;
		categoryElement.textContent = option.name;
		categoryInput.appendChild(categoryElement);
	});
}

function resetInputFields() {
	imageInput.value = '';
	titleInput.value = '';
}

function validateForm() {
	modalForm.addEventListener('change', () => {
		// imageInput.files.length === 0
		if (currentFile !== '' && titleInput.value !== '') {
			validateButton.style.background = '#1D6154';
			return;
		} else {
			validateButton.style.background = null;
		}
	});
}

function resetFormValidation() {
	validateButton.style.background = null;
}

async function sendWorks() {
	console.log('send works');

	const bearer = sessionStorage.getItem('token');
	const formValue = {
		image: currentFile,
		title: titleInput.value,
		category: categoryInput.value,
	};
	console.log(formValue.image);

	const formData = new FormData();
	formData.append('imageUrl', formValue.image);
	formData.append('title', formValue.title);
	formData.append('categoryId', formValue.category);

	const response = await fetch(`http://localhost:5678/api/works`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${bearer}`,
		},
		body: formData,
	});

	if (response.ok) {
		console.log('Work added successfully');
	} else {
		console.log('Failed to add work');
	}
	console.log('finish send works');
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
	resetPreview();
});

addImageButton.addEventListener('click', () => {
	imageInput.click();
});

imageInput.addEventListener('change', updatePreview);

validateButton.addEventListener('click', sendWorks);
