import { GETworks } from "/scripts/config.js";

export async function displayWorks() {
    //Get works by API
    const works = await fetch(GETworks).then((works) => works.json());
    let figure = "";
    dispaly(works)
}

function dispaly(array){
    let figure = "";
    // Loop in works for add html node in figure to add inner div.gallery
    array.forEach((element) => {
        figure += `<figure>
        <img src="${element.imageUrl}" alt="${element.title}" categorie-name="${element.category.name}">
        <figcaption>${element.title}</figcaption>
        </figure>`;
    });
    document.querySelector(".gallery").innerHTML = figure;
}

export function filters(){
    const filterBtn = document.querySelectorAll(".filters");
    filterBtn.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const works = await fetch(GETworks).then((works) => works.json());
            if (id != 0) {
                const filteredBtn = works.filter((element) => element.categoryId == id);
                dispaly(filteredBtn);
            } else dispaly(works);
        });
        
    });
}