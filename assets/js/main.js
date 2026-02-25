// ============================
// VARIABLES GLOBALES
// ============================

const tendenciasContainer = document.getElementById("tendencias-container");
const todosContainer = document.getElementById("todos-container");
const loadMoreBtn = document.getElementById("load-more");

let perfumesData = [];
let visibleCount = 5;


// ============================
// FETCH JSON
// ============================

fetch("assets/js/perfumes.json")
    .then(response => response.json())
    .then(data => {
        perfumesData = data;

        // Ordenar por fecha (más nuevo primero)
        perfumesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        renderTendencias();
        renderTodos();
        initObserver();
    })
    .catch(error => console.error("Error cargando perfumes:", error));


// ============================
// CREAR TARJETA
// ============================

function createCard(perfume, isTendencia = false) {
    const card = document.createElement("div");
    card.classList.add("perfume-card");

    card.innerHTML = `
        <div class="image-wrapper">
            ${isTendencia ? `<span class="badge-oferta">Oferta Relámpago</span>` : ""}
            <img src="${perfume.imagen}" alt="${perfume.nombre}">
        </div>
        <div class="perfume-info">
            <h3>${perfume.nombre}</h3>
            <p>Vendido por: ${perfume.vendedor}</p>
            <a href="${perfume.link}" target="_blank" class="btn-primary">
                Ver en Mercado Libre
            </a>
        </div>
    `;

    return card;
}


// ============================
// RENDER TENDENCIAS
// ============================
function renderTendencias() {
    const tendencias = perfumesData.filter(p => p.tendencia === true);

    tendencias.forEach(perfume => {
        const card = createCard(perfume, true);
        tendenciasContainer.appendChild(card);
    });
}

// ============================
// RENDER TODOS
// ============================

function renderTodos() {
    todosContainer.innerHTML = "";

    const restantes = perfumesData.filter(p => !p.tendencia);

    restantes.slice(0, visibleCount).forEach(perfume => {
        const card = createCard(perfume);
        todosContainer.appendChild(card);
    });

    if (visibleCount >= restantes.length) {
        loadMoreBtn.style.display = "none";
    }
}


// ============================
// BOTÓN VER MÁS
// ============================

loadMoreBtn.addEventListener("click", () => {
    visibleCount += 12;
    renderTodos();
    initObserver();
});


// ============================
// FADE-IN CON INTERSECTION OBSERVER
// ============================

function initObserver() {
    const cards = document.querySelectorAll(".perfume-card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        if (!card.classList.contains("show")) {
            observer.observe(card);
        }
    });
}

// ============================
// MENÚ LATERAL MOBILE PRO
// ============================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = navLinks.querySelectorAll("a");

// Abrir / cerrar
menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
});

// Cerrar al tocar un enlace
navItems.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
    });
});

// Cerrar al tocar fuera
document.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
});

// Evitar cierre si se toca dentro del menú
navLinks.addEventListener("click", (e) => {
    e.stopPropagation();
});