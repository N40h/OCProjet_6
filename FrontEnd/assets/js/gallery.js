/***********************
/*         DOM
/**********************/
const GALLERY = document.querySelector('.gallery');
const FILTERS = document.querySelector('.filters');

/***********************
/*      Variables
/**********************/
let works = [];
let categories = [];
let displayedWorks = [];

/***********************
/*      Functions
/**********************/
// Fetches works data and render them in the gallery
async function getWorks() {
	const response = await fetch('http://localhost:5678/api/works');
	works = await response.json();

	displayedWorks = works;

	renderWorks(displayedWorks);
}

// Fetches categories data and renders the filter buttons
async function getCategories() {
	const response = await fetch('http://localhost:5678/api/categories');
	categories = await response.json();

	renderCategories(categories);
}

// Renders works in the gallery based on the provided data
function renderWorks(data) {
	GALLERY.innerHTML = '';

	data.forEach((work) => {
		let galleryItem = document.createElement('figure');
		let galleryItemImage = document.createElement('img');
		let galleryItemTitle = document.createElement('figcaption');

		galleryItemImage.src = work.imageUrl;
		galleryItemImage.alt = work.title;
		galleryItemTitle.textContent = work.title;

		galleryItem.appendChild(galleryItemImage);
		galleryItem.appendChild(galleryItemTitle);
		GALLERY.appendChild(galleryItem);
	});
}

// Renders filters buttons based on the provided categories
function renderCategories(data) {
	FILTERS.innerHTML = '';

	const filtersAllButton = document.createElement('button');
	filtersAllButton.textContent = 'Tous';
	FILTERS.appendChild(filtersAllButton);

	data.forEach((category) => {
		let filtersButton = document.createElement('button');
		filtersButton.textContent = category.name;

		FILTERS.appendChild(filtersButton);

		filtersButton.addEventListener('click', () => {
			const filteredWorks = works.filter(
				(work) => work.categoryId === category.id
			);
			renderWorks(filteredWorks);
		});
	});

	filtersAllButton.addEventListener('click', () => {
		renderWorks(displayedWorks);
	});
}

getCategories();
getWorks();
