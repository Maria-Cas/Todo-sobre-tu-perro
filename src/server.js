const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const { razasMapping, infoRazas } = require("./data/razas");

const app = express();
const puerto = process.env.PORT || 3000;
const CACHE_TIEMPO = 5 * 60 * 1000; // 5 minutos

// Configuración
app.use(express.static(path.join(__dirname, "../public")));

// Cache con Map
const cache = new Map();

// Funciones auxiliares
const obtenerDatosAPI = async (url) => {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    console.error(`Error al obtener datos de ${url}:`, error);
    throw error;
  }
};

const obtenerConCache = async (url) => {
  const datosCache = cache.get(url);
  if (datosCache?.timestamp > Date.now() - CACHE_TIEMPO) {
    return datosCache.data;
  }
  const datos = await obtenerDatosAPI(url);
  cache.set(url, { data: datos, timestamp: Date.now() });
  return datos;
};

const obtenerInfoRaza = (raza) => {
  const info = infoRazas[razasMapping[raza]] || infoRazas[raza];
  if (info) return info;

  const nombreFormateado = raza
    .split("-")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

  return {
    nombre: nombreFormateado,
    origen: "Origen desconocido",
    descripcion: "Información no disponible para esta raza",
    infoOrigen: "No tenemos información detallada sobre el origen de esta raza",
    esperanzaVida: "No disponible",
  };
};

// Rutas
app.get("/", async (req, res) => {
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

app.get("/razas", async (req, res) => {
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

app.get("/raza/:nombre", async (req, res) => {
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

// Iniciar el servidor
app.listen(puerto, () => {
  console.log(`✨ Servidor corriendo en http://localhost:${puerto}`);
});
