import "./style.css";
import { obtenerInfoRaza } from "../../utils/razas.js";

const API_BASE = "https://dog.ceo/api";

async function fetchDogData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Renderizar la página principal
async function renderHome() {
  try {
    const { message: imagenPerro } = await fetchDogData("/breeds/image/random");
    document.querySelector("#app").innerHTML = `
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" onclick="return false;">Inicio</a> |
          <a href="#/razas" onclick="return false;">Lista de Razas</a>
        </nav>
        <div class="pagina-inicio">
          <div class="hero-section">
            <div class="hero-content">
              <h1>Descubre el Mundo de los Perros</h1>
              <p>Explora diferentes razas y aprende todo sobre estos maravillosos compañeros</p>
              <a href="#/razas" class="boton-principal" onclick="return false;">Ver Razas</a>
            </div>
            <div class="hero-imagen">
              <img src="${imagenPerro}" alt="Perro aleatorio" class="imagen-hero"
                   onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error rendering home:", error);
    mostrarError();
  }
}

// Renderizar la lista de razas
async function renderBreeds() {
  try {
    const { message: razas } = await fetchDogData("/breeds/list/all");
    const razasPromesas = Object.keys(razas).map(async (raza) => {
      try {
        const { message: imagen } = await fetchDogData(
          `/breed/${raza}/images/random`
        );
        const info = obtenerInfoRaza(raza);
        return { nombre: info.nombre, imagen, raza };
      } catch (error) {
        return {
          nombre: obtenerInfoRaza(raza).nombre,
          imagen:
            "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",
          raza,
        };
      }
    });

    const razasConImagenes = await Promise.all(razasPromesas);
    const tarjetasHTML = razasConImagenes
      .map(
        ({ nombre, imagen, raza }) => `
          <a href="#/raza/${raza}" class="tarjeta" onclick="return false;">
            <img src="${imagen}" alt="${nombre}" class="imagen" 
                 onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            <div class="contenido">
              <h3>${nombre}</h3>
            </div>
          </a>
        `
      )
      .join("");

    document.querySelector("#app").innerHTML = `
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" onclick="return false;">Inicio</a> |
          <a href="#/razas" onclick="return false;">Lista de Razas</a>
        </nav>
        <div class="cuadricula">
          ${tarjetasHTML}
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error rendering breeds:", error);
    mostrarError();
  }
}

// Renderizar detalles de una raza
async function renderBreedDetails(breed) {
  try {
    const { message: imagenes } = await fetchDogData(`/breed/${breed}/images`);
    const info = obtenerInfoRaza(breed);
    const imagenPrincipal =
      imagenes[0] ||
      "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg";
    const imagenesGaleria = imagenes.slice(1, 4).filter((img) => img);

    document.querySelector("#app").innerHTML = `
      <div class="header">
        <h1>🐕 Todo sobre tu perro</h1>
      </div>
      <div class="contenedor">
        <nav>
          <a href="#/" onclick="return false;">Inicio</a> |
          <a href="#/razas" onclick="return false;">Lista de Razas</a>
        </nav>
        <div class="detalle-raza">
          <h1>${info.nombre}</h1>
          <div class="info-principal">
            <div class="imagen-contenedor">
              <img src="${imagenPrincipal}" alt="${
      info.nombre
    }" class="imagen-principal"
                   onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            </div>
            <div class="info-contenido">
              <div class="info-item">
                <h3>Origen:</h3>
                <p>${info.origen}</p>
              </div>
              <div class="info-item">
                <h3>Descripción:</h3>
                <p>${info.descripcion}</p>
              </div>
              <div class="info-item">
                <h3>Historia:</h3>
                <p>${info.infoOrigen}</p>
              </div>
              <div class="info-item">
                <h3>Esperanza de vida:</h3>
                <p>${info.esperanzaVida}</p>
              </div>
            </div>
          </div>
          ${
            imagenesGaleria.length > 0
              ? `
            <h2>Más fotos</h2>
            <div class="galeria-imagenes">
              ${imagenesGaleria
                .map(
                  (img) => `
                <div class="imagen-contenedor">
                  <img src="${img}" alt="${info.nombre}" class="imagen-galeria"
                       onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error rendering breed details:", error);
    mostrarError();
  }
}

function mostrarError() {
  document.querySelector("#app").innerHTML = `
    <div class="error">
      <h2>¡Ups! Algo salió mal</h2>
      <p>No pudimos cargar la información. Por favor, intenta de nuevo más tarde.</p>
      <a href="#/" class="boton-principal">Volver al inicio</a>
    </div>
  `;
}

// Router
function handleRoute() {
  const hash = window.location.hash || "#/";

  if (hash === "#/") {
    renderHome();
  } else if (hash === "#/razas") {
    renderBreeds();
  } else if (hash.startsWith("#/raza/")) {
    const breed = hash.split("/")[2];
    renderBreedDetails(breed);
  }
}

// Inicializar la aplicación
window.addEventListener("hashchange", handleRoute);
handleRoute();
