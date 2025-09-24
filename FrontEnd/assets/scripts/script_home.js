//----------------------------------------------------------------------
// Récupération et affichage des oeuvres et catégories
async function initGallery() {
  try {
    // Récupérer les oeuvres
    const worksResponse = await fetch("http://127.0.0.1:5678/api/works");
    if (!worksResponse.ok) throw new Error(`Erreur HTTP (works) : ${worksResponse.status}`);
    const works = await worksResponse.json();

    // Récupérer les catégories
    const categoriesResponse = await fetch("http://127.0.0.1:5678/api/categories");
    if (!categoriesResponse.ok) throw new Error(`Erreur HTTP (categories) : ${categoriesResponse.status}`);
    const categories = await categoriesResponse.json();

    // Supprimer les doublons de catégories
    const uniqueCategories = [...new Map(categories.map(cat => [cat.id, cat])).values()];

    // Afficher les oeuvres
    displayWorks(works);

    // Afficher les filtres
    displayCategories(uniqueCategories, works);

  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
}

//----------------------------------------------------------------------
// Affichage des oeuvres
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(({ id, imageUrl, title }) => {
    const figure = document.createElement("figure");
    figure.dataset.id = id; //stock l'id de l'oeuvre dans l'élément pour la suppression
    figure.innerHTML = `<img src="${imageUrl}" alt="${title}"><figcaption>${title}</figcaption>`;
    gallery.appendChild(figure);
  });
}

//----------------------------------------------------------------------
// Affichage des catégories et filtres
function displayCategories(categories, works) {
  const container = document.querySelector(".container-filter");
  container.innerHTML = "";

  const setActive = button => {
    container.querySelectorAll(".button-filter").forEach(btn => btn.classList.remove("active-filter"));
    button.classList.add("active-filter");
  };

  // Bouton "Tous"
  const allButton = document.createElement("button");
  allButton.className = "button-filter";
  allButton.textContent = "Tous";
  allButton.onclick = () => { displayWorks(works); setActive(allButton); };
  container.appendChild(allButton);

  // Boutons par catégorie
  categories.forEach(({ id, name }) => {
    const btn = document.createElement("button");
    btn.className = "button-filter";
    btn.textContent = name;
    btn.onclick = () => { displayWorks(works.filter(w => w.categoryId === id)); setActive(btn); };
    container.appendChild(btn);
  });

  setActive(allButton);
}

//----------------------------------------------------------------------
// Lancer la galerie
initGallery();


//----------------------------------------------------------------------
// Détecte la page active et créé la class active sur le a actif
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});


//------------------------------------------------------------------
// Initialisation de l’état login/logout
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const modeEditBar = document.querySelector(".bar-edit");
    const btnModifier = document.querySelector(".btn-modifier");
    const loginLogoutLink = document.getElementById("login-logout");
    const filters = document.querySelector(".container-filter");

    if (token) {
        // Si utilisateur connecté alors on affiche édition
        modeEditBar.style.display = "flex";
        btnModifier.style.display = "inline-block";
        filters.style.display = "none";

        // Transformation login/logout
        loginLogoutLink.textContent = "logout";
        loginLogoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        // Si utilisateur déconnecté alors on cache édition
        modeEditBar.style.display = "none";
        btnModifier.style.display = "none";
        filters.style.display = "flex"

        // Lien reste "login"
        loginLogoutLink.textContent = "login";
        loginLogoutLink.setAttribute("href", "login.html");
    }
});

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "home.html";
}

// ----------------------------------------------------------------------
// Création dynamique de la modale
const modal = document.createElement("aside");
modal.id = "modal-gallery";
modal.classList.add("modal");
modal.setAttribute("aria-hidden", "true");
modal.setAttribute("role", "dialog");

// Contenu de la modale
const modalContent = document.createElement("div");
modalContent.classList.add("modal-content");

// Bouton fermer
const closeBtn = document.createElement("span");
closeBtn.classList.add("close");
closeBtn.innerHTML = "&times;";
closeBtn.addEventListener("click", closeModal);

// Titre
const modalTitle = document.createElement("h3");
modalTitle.textContent = "Galerie photo";

// Container des images
const modalImagesContainer = document.createElement("div");
modalImagesContainer.classList.add("modal-images");

// Wrapper pour le bouton ajouter
const wrapperAjoutPhoto = document.createElement("div");
wrapperAjoutPhoto.classList.add("wrapperAjoutPhoto");

// Bouton ajouter
const btnAjoutPhoto = document.createElement("button");
btnAjoutPhoto.classList.add("btn-ajoutPhoto");
btnAjoutPhoto.textContent = "Ajouter une photo";
btnAjoutPhoto.addEventListener("click", () => {
    alert("Formulaire d’ajout de photo à afficher ici !");
});
wrapperAjoutPhoto.appendChild(btnAjoutPhoto);
wrapperAjoutPhoto.style.display = "none";

// Assemblage de la modale
modalContent.append(closeBtn, modalTitle, modalImagesContainer, wrapperAjoutPhoto);
modal.appendChild(modalContent);
document.body.appendChild(modal);

// ----------------------------------------------------------------------
// Récupération des oeuvres
async function fetchWorks() {
    try {
        const res = await fetch("http://127.0.0.1:5678/api/works");
        if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Erreur lors de la récupération des oeuvres :", err);
        return [];
    }
}

// ----------------------------------------------------------------------
// Affichage des oeuvres dans la modale avec la corbeille
function displayWorksInModal(works) {
    modalImagesContainer.innerHTML = "";
    works.forEach(({ id, imageUrl, title }) => {
        const figure = document.createElement("figure");
        figure.dataset.id = id;
        figure.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <button class="btn-delete"><i class="fa-solid fa-trash-can"></i></button>
        `;
        modalImagesContainer.appendChild(figure);

        // Bouton supprimer avec confirmation
        figure.querySelector(".btn-delete").addEventListener("click", () => {
            const confirmDelete = confirm("Voulez-vous vraiment supprimer cette œuvre ?");
            if (confirmDelete) {
                deleteWork(id, figure);
            }
        });
    });
}

// ----------------------------------------------------------------------
// Bouton modifier
const btnModifier = document.querySelector(".btn-modifier");
btnModifier?.addEventListener("click", async () => {
    const works = await fetchWorks();
    displayWorksInModal(works);
    modal.style.display = "block";
    wrapperAjoutPhoto.style.display = "flex";
});

// ----------------------------------------------------------------------
// Fermer la modale
function closeModal() {
    modal.style.display = "none";
    wrapperAjoutPhoto.style.display = "none";
}
window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// ----------------------------------------------------------------------
// Supprimer une oeuvre
async function deleteWork(id, figure) {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`http://127.0.0.1:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.ok) {
            // Supprimer dans la modale
            figure.remove();

            // Supprimer dans la galerie principale
            const galleryFigure = document.querySelector(`.gallery figure[data-id="${id}"]`);
            galleryFigure?.remove();
            console.log(`Oeuvre ${id} supprimée`);
        } else {
            console.error(`Échec de suppression (status ${res.status})`);
        }
    } catch (err) {
        console.error("Erreur lors de la suppression :", err);
    }
}
