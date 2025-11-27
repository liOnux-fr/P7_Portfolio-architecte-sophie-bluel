import { URLworks, GETcategory, POSTlogin } from "/scripts/config.js";

export async function displayWorks() {
    //Get works by API
    const works = await getworks();
    dispaly(works);
}

async function getworks() {
    return await fetch(URLworks).then((works) => works.json());
}

async function getcategory() {
    return await fetch(GETcategory).then((category) => category.json());
}

async function postWorks(image, title, categoryId) {
    const body = {
        image: image,
        title: title,
        category: categoryId,
    };
    return await fetch(URLworks, {
        method: "POST",
        headers: {
            "Content-Type": "mutipart/form-data",
            Authorization: "Bearer " + window.localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
    }).then((result) => result.json());
}

async function delWorks(id) {
    return await fetch(URLworks + "/" + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + window.localStorage.getItem("token"),
        },
    }).then((r) => console.log(r.ok));
}

function dispaly(array) {
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

export function login() {
    //recupere le formulaire
    if (window.location.href !== "http://127.0.0.1:5500/login.html") return 0;
    const form = document.querySelector(".login form");
    form.addEventListener("submit", async (event) => {
        //desactive le recharhement de la page
        event.preventDefault();

        //Recupere les valeurs des champs
        const email = document.getElementById("email");
        const password = document.getElementById("password");

        //Construis le body et envoie la requete
        const body = {
            email: email.value,
            password: password.value,
        };
        let connection = await fetch(POSTlogin, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        //Si le code de status n'est pas 200, l'email ou le mot de passe est incorrect
        if (connection.status !== 200) {
            //Fais apparaitre un message d'erreur
            const error = document.querySelector(".error");
            console.log(connection.body);
            error.style.display = "block";
        } else {
            //Récupere les donnée au format json
            let result = await connection.json();
            //Si on ne trouve pas de données de connexion dans le local storage, on les initialise
            if (userConnected() === null) {
                window.localStorage.setItem("userId", result.userId);
                window.localStorage.setItem("token", result.token);
            }
            //redirige sur la page principale
            window.location.href = "http://127.0.0.1:5500/index.html";
        }
    });
}

//fonction pour savoir si l'utilidsateur est deja connécté
export function userConnected() {
    return window.localStorage.getItem("userId") || window.localStorage.getItem("token");
}

export async function filters() {
    const divFilters = document.querySelector(".filters");
    const category = await fetch(GETcategory).then((category) => category.json());
    divFilters.innerHTML += `<button id="0" class="active">Tous</button>`;
    category.forEach((c) => {
        let btn = `<button id="${c.id}">${c.name}</button>`;
        divFilters.innerHTML += btn;
    });

    const filterBtn = document.querySelectorAll(".filters");

    filterBtn.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const filterBtns = document.querySelectorAll(".filters button");
            filterBtns.forEach((btn) => {
                btn.classList.remove("active");
            });
            e.target.classList.add("active");

            const id = e.target.id;
            console.log(id);

            const works = await fetch(URLworks).then((works) => works.json());
            if (id != 0) {
                const filteredBtn = works.filter((element) => element.categoryId == id);
                dispaly(filteredBtn);
            } else dispaly(works);
        });
    });
}

export function editionMode() {
    //affiche le bandeau
    const bandeau = document.querySelector(".editonMode");
    bandeau.style.setProperty("display", "flex");

    //Change le login en logout et ajoute la fonctionnalité de deconnection
    const log = document.querySelector(".log");
    log.innerHTML = '<a href="">log out</a>';
    log.addEventListener("click", (e) => {
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("token");
    });

    //Affiche le texte modifier
    const txtModifier = document.querySelector("span.edition");
    txtModifier.style.setProperty("display", "inline");
    // txtModifier.addEventListener("click", (e) => {
    //     alert(txtModifier)
    // })
}

export function initModal() {
    if (window.location.href !== "http://127.0.0.1:5500/index.html") return 0;

    //Initiaalisation des variables pour la modal
    const open = document.querySelector("span.edition");
    const background = document.querySelector(".modal-background");
    const close = document.getElementById("modal-close");
    const next = document.getElementById("modal-next");
    const back = document.getElementById("modal-back");

    //Ajoute les evenements sur les boutons et le background
    next.addEventListener("click", () => {
        modal("next");
        addWorks();
    });
    close.addEventListener("click", () => {
        modal("close");
    });
    background.addEventListener("click", () => {
        modal("close");
    });
    open.addEventListener("click", () => {
        modal("open");
        imgGalery();
    });
    back.addEventListener("click", () => {
        modal("return");
        imgGalery();
    });
}

function modal(action) {
    //initialisation des varibles des modals et du background
    const background = document.querySelector(".modal-background");
    const mdelete = document.querySelector(".modal-delete");
    const madd = document.querySelector(".modal-add");

    // determine ce que l'on veut faire en fonction de l'action passée
    switch (action) {
        case "open":
            mdelete.style.setProperty("display", "flex");
            background.style.setProperty("display", "block");
            break;
        case "next":
            madd.style.setProperty("display", "flex");
            mdelete.style.setProperty("display", "none");
            break;
        case "return":
            madd.style.setProperty("display", "none");
            mdelete.style.setProperty("display", "flex");
            break;
        case "close":
        default:
            mdelete.style.setProperty("display", "none");
            background.style.setProperty("display", "none");
            madd.style.setProperty("display", "none");
            break;
    }
}

async function imgGalery() {
    const works = await getworks();
    displayIMGgalery(works, ".modal-galery");
    const btnSuppr = document.querySelectorAll(".btn-suppr");
    for (let btn of btnSuppr) {
        btn.addEventListener("click", async () => {
            await delWorks(btn.id);
            imgGalery();
        });
    }
}

function displayIMGgalery(works, selector) {
    let figure = "";
    works.forEach((element) => {
        figure += `<article>
                    <img src="${element.imageUrl}" alt="${element.title}" class="modal-galery-img"/>
                    <button type="button" class="btn-suppr" id="${element.id}">
                        <img src="assets/icons/Poubele.svg" alt="Supprimer" />
                    </button>
                </article>`;
    });
    document.querySelector(selector).innerHTML = figure;
}

async function addWorks() {
    const title = document.getElementById("title");

    const select = document.getElementById("category");
    const categorys = await getcategory();

    const form = document.querySelector(".modal-add form");

    title.addEventListener("keyup", () => {
        validForm(title, select, preimage);
    });

    categorys.forEach((c) => {
        let option = document.createElement("option");
        option.innerText = c.name;
        option.value = c.name;
        option.id = c.id;
        select.appendChild(option);
        console.log(option);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("categoryId", select.selectedOptions[0].id);
        formData.append("image", preimage.files[0]);
        console.log(formData);
        // const reader = new FileReader();
        // let dataimg = "";
        // reader.onload = () => {
        //     dataimg = reader.result;

        //     console.log(dataimg);

        postWorks(dataimg, title.value, select.selectedOptions[0].id);
        // }
        // reader.readAsBinaryString(preimage.files[0]);
    });

    const image = document.querySelector(".file img");
    const preimage = document.getElementById("file");
    preimage.addEventListener("change", (e) => {
        if (preimage.files[0] !== undefined) {
            image.src = URL.createObjectURL(preimage.files[0]);
            image.onload = () => {
                URL.revokeObjectURL(image.src);
            };
            const div = document.querySelector(".file div"),
                p = document.querySelector(".file p ");
            div.style.display = "none";
            p.style.display = "none";
            image.style.height = "100%";
            image.style.width = "auto";
        }
    });
}

function validForm(title, select, preimage) {
    const btn = document.getElementById("btn-save-works");
    if (title.value !== "" && select.options.length != 0 && preimage.files.length === 1) {
        btn.disabled = false;
    } else btn.disabled = true;
}
