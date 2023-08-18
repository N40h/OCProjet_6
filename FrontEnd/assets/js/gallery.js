/***********************
/*         DOM
/**********************/
const gallery = document.querySelector('.gallery');

/***********************
/*      Functions
/**********************/
async function getWorks() {
	const response = await fetch('http://localhost:5678/api/works');
	const data = await response.json();
	console.log(data);
	display(data);
}
getWorks();

function display(data) {
	for (let i = 0; i < data.length; i++) {
		const galleryItem = document.createElement('figure');
		const galleryItemImage = document.createElement('img');
		galleryItemImage.src = data[i].imageUrl;
		const galleryItemTitle = document.createElement('figcaption');

		galleryItemTitle.innerHTML += data[i].title;

		gallery.appendChild(galleryItem);
		galleryItem.appendChild(galleryItemImage);
		galleryItem.appendChild(galleryItemTitle);
	}
}
display(data);
