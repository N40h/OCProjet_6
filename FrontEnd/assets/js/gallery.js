/***********************
/*         DOM
/**********************/
const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters');

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
	const data = await response.json();

	works = data;
	displayedWorks = works;

	displayWorks(displayedWorks);
}

async function getCategories() {
	const response = await fetch('http://localhost:5678/api/categories');
	const data = await response.json();

	categories = data;

	displayCategories(categories);
}

function displayWorks(data) {
	gallery.innerHTML = '';

	data.forEach((work) => {
		let galleryItem = document.createElement('figure');
		let galleryItemImage = document.createElement('img');
		let galleryItemTitle = document.createElement('figcaption');

		galleryItemImage.src = work.imageUrl;
		galleryItemTitle.innerHTML = work.title;

		gallery.appendChild(galleryItem);
		galleryItem.appendChild(galleryItemImage);
		galleryItem.appendChild(galleryItemTitle);
	});
}

function displayCategories(data) {
	const filtersAllButton = document.createElement('button');
	filtersAllButton.textContent = 'Tous';
	filters.appendChild(filtersAllButton);

	categories.forEach((category) => {
		let filtersButton = document.createElement('button');
		filtersButton.textContent = category.name;

		filters.appendChild(filtersButton);

		filtersButton.addEventListener('click', () => {
			const filteredWorks = works.filter(
				(work) => work.categoryId === category.id
			);
			displayWorks(filteredWorks);
		});
	});

	filtersAllButton.addEventListener('click', () => {
		displayWorks(displayedWorks);
	});
}

getCategories();
getWorks();
