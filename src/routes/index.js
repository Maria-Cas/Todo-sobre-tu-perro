const express = require("express");
const router = express.Router();
const { obtenerConCache } = require("../utils/api");
const { obtenerInfoRaza } = require("../utils/razas");

// Ruta principal
router.get("/", async (req, res) => {
  try {
    const { message: imagenPerro } = await obtenerConCache("https://dog.ceo/api/breeds/image/random");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Todo sobre tu perro</title>
          <link rel="stylesheet" href="/styles/main.css">
        </head>
        <body>
          <div class="header">
            <h1>🐕 Todo sobre tu perro</h1>
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a>
            </nav>
            <div class="pagina-inicio">
              <div class="hero-section">
                <div class="hero-content">
                  <h1>Descubre el Mundo de los Perros</h1>
                  <p>Explora diferentes razas y aprende todo sobre estos maravillosos compañeros</p>
                  <a href="/razas" class="boton-principal">Ver Razas</a>
                </div>
                <div class="hero-imagen">
                  <img src="${imagenPerro}" alt="Perro aleatorio" class="imagen-hero"
                       onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error al cargar la página");
  }
});

// Ruta para listar todas las razas
router.get("/razas", async (req, res) => {
  try {
    const { message: razas } = await obtenerConCache("https://dog.ceo/api/breeds/list/all");
    const razasPromesas = Object.keys(razas).map(async (raza) => {
      try {
        const { message: imagen } = await obtenerConCache(`https://dog.ceo/api/breed/${raza}/images/random`);
        const info = obtenerInfoRaza(raza);
        return { nombre: info.nombre, imagen, raza };
      } catch (error) {
        return {
          nombre: obtenerInfoRaza(raza).nombre,
          imagen: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",
          raza,
        };
      }
    });

    const razasConImagenes = await Promise.all(razasPromesas);
    const tarjetasHTML = razasConImagenes
      .map(
        ({ nombre, imagen, raza }) => `
          <a href="/raza/${raza}" class="tarjeta">
            <img src="${imagen}" alt="${nombre}" class="imagen" 
                 onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            <div class="contenido">
              <h3>${nombre}</h3>
            </div>
          </a>
        `
      )
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Razas de Perros</title>
          <link rel="stylesheet" href="/styles/main.css">
        </head>
        <body>
          <div class="header">
            <h1>🐕 Todo sobre tu perro</h1>
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a>
            </nav>
            <div class="cuadricula">
              ${tarjetasHTML}
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error al cargar las razas");
  }
});

// Ruta para ver detalles de una raza específica
router.get("/raza/:nombre", async (req, res) => {
  try {
    const raza = req.params.nombre;
    const { message: imagenes } = await obtenerConCache(`https://dog.ceo/api/breed/${raza}/images`);
    const info = obtenerInfoRaza(raza);
    const imagenPrincipal = imagenes[0] || "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg";
    const imagenesGaleria = imagenes.slice(1, 4).filter((img) => img);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Raza: ${info.nombre}</title>
          <link rel="stylesheet" href="/styles/main.css">
        </head>
        <body>
          <div class="header">
            <h1>🐕 Todo sobre tu perro</h1>
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a>
            </nav>
            <div class="detalle-raza">
              <h1>${info.nombre}</h1>
              <div class="info-principal">
                <div class="imagen-contenedor">
                  <img src="${imagenPrincipal}" alt="${info.nombre}" class="imagen-principal"
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
              ${imagenesGaleria.length > 0
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
                : ""}
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error al cargar la raza");
  }
});

module.exports = router;
