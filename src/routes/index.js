// Importación de dependencias
const express = require("express");  // Importa la librería Express, que es el framework para crear el servidor.
const router = express.Router();  // Crea un router de Express, que permite gestionar las rutas de la aplicación.
const { obtenerConCache } = require("../utils/api");  // Función para obtener datos de la API con caché.
const { obtenerInfoRaza } = require("../utils/razas");  // Función para obtener información adicional de las razas de perros.

// Ruta principal que maneja las peticiones GET a la raíz del sitio (/)
router.get("/", async (req, res) => {
  try {
    // Se realiza una solicitud a la API de "dog.ceo" para obtener una imagen aleatoria de un perro.
    const { message: imagenPerro } = await obtenerConCache("https://dog.ceo/api/breeds/image/random");

    // Si la solicitud es exitosa, se devuelve una página HTML con la imagen y un mensaje de bienvenida.
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Todo sobre tu perro</title>
          <link rel="stylesheet" href="/styles/main.css"> <!-- Se incluye el archivo CSS para estilos -->
        </head>
        <body>
          <div class="header">
            <h1>🐕 Todo sobre tu perro</h1>  <!-- Título principal -->
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a> <!-- Enlaces de navegación -->
            </nav>
            <div class="pagina-inicio">
              <div class="hero-section">
                <div class="hero-content">
                  <h1>Descubre el Mundo de los Perros</h1> <!-- Mensaje principal -->
                  <p>Explora diferentes razas y aprende todo sobre estos maravillosos compañeros</p> <!-- Descripción -->
                  <a href="/razas" class="boton-principal">Ver Razas</a> <!-- Enlace a la página de razas -->
                </div>
                <div class="hero-imagen">
                  <!-- Imagen aleatoria del perro -->
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
    // Si ocurre un error, se responde con un mensaje de error.
    res.status(500).send("Error al cargar la página");
  }
});


// Ruta para listar todas las razas de perros
router.get("/razas", async (req, res) => {
  try {
    // Se obtiene la lista de todas las razas de la API "dog.ceo"
    const { message: razas } = await obtenerConCache("https://dog.ceo/api/breeds/list/all");
    
    // Para cada raza, obtenemos una imagen aleatoria y su información adicional
    const razasPromesas = Object.keys(razas).map(async (raza) => {
      try {
        // Obtenemos una imagen aleatoria para cada raza
        const { message: imagen } = await obtenerConCache(`https://dog.ceo/api/breed/${raza}/images/random`);
        // Obtenemos la información detallada de la raza (probablemente de una base de datos interna)
        const info = obtenerInfoRaza(raza);
        return { nombre: info.nombre, imagen, raza };  // Devolvemos el nombre, imagen y nombre de la raza
      } catch (error) {
        // Si ocurre un error al obtener la imagen, se utiliza una imagen predeterminada
        return {
          nombre: obtenerInfoRaza(raza).nombre,
          imagen: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",  // Imagen por defecto
          raza,
        };
      }
    });

    // Esperamos que todas las promesas de razas se resuelvan antes de continuar
    const razasConImagenes = await Promise.all(razasPromesas);

    // Generamos el HTML para mostrar cada raza en tarjetas
    const tarjetasHTML = razasConImagenes
      .map(
        ({ nombre, imagen, raza }) => `
          <a href="/raza/${raza}" class="tarjeta">  <!-- Cada tarjeta es un enlace a la página de detalles de la raza -->
            <img src="${imagen}" alt="${nombre}" class="imagen" 
                 onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">  <!-- Imagen de la raza -->
            <div class="contenido">
              <h3>${nombre}</h3>  <!-- Nombre de la raza -->
            </div>
          </a>
        `
      )
      .join("");  // Unimos todas las tarjetas en un solo bloque de HTML

    // Respondemos con la página HTML que contiene las tarjetas de las razas
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Razas de Perros</title>
          <link rel="stylesheet" href="/styles/main.css"> <!-- Se incluye el archivo CSS -->
        </head>
        <body>
          <div class="header">
            <h1>🐕 Todo sobre tu perro</h1>  <!-- Título -->
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a> <!-- Enlaces de navegación -->
            </nav>
            <div class="cuadricula">
              ${tarjetasHTML}  <!-- Las tarjetas con la información de cada raza se insertan aquí -->
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    // Si ocurre un error, se responde con un mensaje de error.
    res.status(500).send("Error al cargar las razas");
  }
});


// Ruta para ver los detalles de una raza específica
router.get("/raza/:nombre", async (req, res) => {
  try {
    // Se obtiene el nombre de la raza de los parámetros de la URL
    const raza = req.params.nombre;

    // Se obtienen las imágenes de la raza desde la API "dog.ceo"
    const { message: imagenes } = await obtenerConCache(`https://dog.ceo/api/breed/${raza}/images`);
    // Se obtiene la información detallada de la raza (origen, historia, etc.)
    const info = obtenerInfoRaza(raza);
    
    // Se asigna la primera imagen como la imagen principal y las siguientes como imágenes de galería
    const imagenPrincipal = imagenes[0] || "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg";
    const imagenesGaleria = imagenes.slice(1, 4).filter((img) => img);  // Obtenemos las siguientes imágenes para la galería

    // Se genera una página HTML con la información de la raza
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Raza: ${info.nombre}</title>
          <link rel="stylesheet" href="/styles/main.css">  <!-- Archivo CSS -->
        </head>
        <body>
          <div class="header">
            <h1>🐕 Todo sobre tu perro</h1>  <!-- Título -->
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a>  <!-- Enlaces de navegación -->
            </nav>
            <div class="detalle-raza">
              <h1>${info.nombre}</h1>  <!-- Nombre de la raza -->
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
              <!-- Si hay imágenes de galería, se muestran aquí -->
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
    // Si ocurre un error, se responde con un mensaje de error.
    res.status(500).send("Error al cargar la raza");
  }
});


module.exports = router;
