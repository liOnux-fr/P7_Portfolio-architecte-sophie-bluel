const filters = document.querySelector("#filter-button");
const gallery = document.querySelector(".gallery");
const urlAPI = "http://localhost:5678/api/"

function majGallery(id) {
	gallery.innerHTML = "";
	fetch(`${urlAPI}works`)
		.then(response => response.json())
		.then(works => {
			if (id > 0) {
				works = works.filter(element => element.categoryId === id);
			}
			works.forEach(element => {
				const baliseFigure = document.createElement("figure");
				const baliseFigcaption = document.createElement("figcaption");
				const baliseImg = document.createElement("img");
				baliseImg.src = element.imageUrl;
				baliseImg.alt = element.title;
				baliseFigcaption.textContent = element.title;
				baliseFigure.append(baliseImg, baliseFigcaption);
				gallery.appendChild(baliseFigure);
			})
		})
};

majGallery(0);

fetch(`${urlAPI}categories`)
	.then(response => response.json())
	.then(categories => {
		filters.innerHTML = "";
		if (categories.length < 2) return;
		filters.innerHTML = `<button class="buttons" type="button" data-id="0">Tous</button>`;
		const TousBtn = document.querySelector("#filter-button .buttons");
		TousBtn.addEventListener("click", () => majGallery(0));
		categories.forEach(element => {
            const baliseBtn = document.createElement("button");
			baliseBtn.classList.add("buttons");
			baliseBtn.type = "button";
			baliseBtn.textContent = element.name;
			baliseBtn.dataset.id = element.id;
			baliseBtn.addEventListener("click", () => majGallery(element.id));
			filters.appendChild(baliseBtn);
		});
	});
