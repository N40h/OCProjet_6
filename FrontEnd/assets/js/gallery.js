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
async function getWorks() {
	const response = await fetch('http://localhost:5678/api/works');
	works = await response.json();

	displayedWorks = works;

	renderWorks(displayedWorks);
}

async function getCategories() {
	const response = await fetch('http://localhost:5678/api/categories');
	categories = await response.json();

	renderCategories(categories);
}

function renderWorks(data) {
	GALLERY.innerHTML = '';

	data.forEach((work) => {
		let galleryItem = document.createElement('figure');
		let galleryItemImage = document.createElement('img');
		let galleryItemTitle = document.createElement('figcaption');

		galleryItemImage.src = work.imageUrl;
		galleryItemImage.alt = work.title;
		galleryItemTitle.innerHTML = work.title;

		galleryItem.appendChild(galleryItemImage);
		galleryItem.appendChild(galleryItemTitle);
		GALLERY.appendChild(galleryItem);
	});
}

function renderCategories(data) {
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
