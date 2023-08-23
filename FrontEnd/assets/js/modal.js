// import {
// 	getWorks,
// 	renderWorks,
// 	getCategories,
// 	renderCategories,
// } from './gallery.js';

/***********************
/*       DOM
/**********************/
const modal = document.getElementById('modal');
const modalCloseButton = modal.querySelector('.modal__close__btn');
const modalOpenLinks = document.querySelectorAll('.open__modal');
const modalGallery = modal.querySelector('.modal__gallery');
/***********************
/*       Variables
/**********************/

/***********************
/*       Functions
/**********************/
function openModal(e) {
	e.preventDefault();
	modal.style.display = 'flex';
	modal.addEventListener('click', closeModal);
	modal
		.querySelector('.modal__wrapper')
		.addEventListener('click', stopPropagation);

	getWorks();
	displayGalleryInModal(displayedWorks);
}

function closeModal() {
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
		let galleryItemTitle = document.createElement('figcaption');

		galleryItemImage.src = item.imageUrl;
		galleryItemImage.alt = item.title;
		galleryItemTitle.textContent = 'éditer';

		galleryItem.appendChild(galleryItemImage);
		galleryItem.appendChild(galleryItemTitle);
		modalGallery.appendChild(galleryItem);
	});
}

/***********************
/*       EventListeners
/**********************/
modalOpenLinks.forEach((link) => {
	link.addEventListener('click', openModal);
});

modalCloseButton.addEventListener('click', closeModal);
