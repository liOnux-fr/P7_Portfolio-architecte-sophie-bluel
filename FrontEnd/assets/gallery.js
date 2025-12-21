const filters = document.querySelector("#filter-button");
const gallery = document.querySelector(".gallery");

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

fetch("http://localhost:5678/api/categories")
	.then(response => response.json())
	.then(datas => {
		filters.innerHTML = `<button type="button" class="buttons">Tous</button>`;
		datas.forEach(element => {
            const baliseBtn = document.createElement("button");
			filters.appendChild(baliseBtn);
			baliseBtn.classList.add("buttons");
			baliseBtn.type = "button";
			baliseBtn.textContent = element.name;
		})
		//datas = ["a"]; console.log(datas.length);
		if (datas.length < 2) {
			filters.innerHTML = "";
		}
	})