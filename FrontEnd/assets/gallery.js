const filters = document.querySelector("#filter-button");
const gallery = document.querySelector(".gallery");

function majGallery(id) {
fetch("http://localhost:5678/api/works")
	.then(response => response.json())
	.then(datas => {
		datas.forEach(element => {
			const baliseFigure = document.createElement("figure");
            const baliseFigcaption = document.createElement("figcaption");
            const baliseImg = document.createElement("img");
			gallery.appendChild(baliseFigure);
			baliseFigure.appendChild(baliseImg);
			baliseImg.src = element.imageUrl;
			baliseImg.alt = element.title;
			baliseFigure.appendChild(baliseFigcaption);
			baliseFigcaption.textContent = element.title;
		})
	})
}

majGallery();

fetch("http://localhost:5678/api/categories")
	.then(response => response.json())
	.then(categories => {
		if (categories.length < 2) {
			return;
		}
		filters.innerHTML = `<button class="buttons" type="button" data-id="0">Tous</button>`;
		const tousBtn = document.querySelector("#filter-button .buttons");
		tousBtn.addEventListener("click", function() {
			console.log(tousBtn.dataset.id);
			majGallery(tousBtn.dataset.id);
		});
		categories.forEach(element => {
            const baliseBtn = document.createElement("button");
			filters.appendChild(baliseBtn);
			baliseBtn.classList.add("buttons");
			baliseBtn.type = "button";
			baliseBtn.textContent = element.name;
			baliseBtn.dataset.id = element.id;
			baliseBtn.addEventListener("click", function() {
				console.log(baliseBtn.dataset.id);
				majGallery(baliseBtn.dataset.id);
			});
		});
	});
	
// buttons.forEach(btn => {
// 	buttons.addEventListener("click", function() {
// 		console.log(baliseBtn.dataset.id)
// 	})
// })

// let filtersTab = []
// filtersTab = Array.from(categories);
// console.log(filtersTab[2]);

