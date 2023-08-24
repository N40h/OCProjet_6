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
const arrowButton = modalTwo.querySelector('.modal__arrow__btn');

/***********************
/*         Variables
/**********************/
let isModalOne = true;

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
	displayGalleryInModal(displayedWorks);
	initModal();
}

function closeModal(e) {
	e.preventDefault();
	modal.style.display = 'none';
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
			const itemID = item.id;

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

	const response = await fetch(`http://localhost:5678/api/works/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${bearer}`,
		},
	});
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
});
