// Importación de módulos
import express from 'express'; // Para crear el servidor
import path from 'path'; // Para trabajar con rutas de archivos
import { fileURLToPath } from 'url'; // Para convertir la URL a ruta de archivo
import fetch from 'node-fetch'; // Para realizar peticiones HTTP
import { razasMapping, infoRazas } from './data/razas.js'; // Importar mapeo de razas y datos

// Obtener el nombre del archivo y el directorio
const __filename = fileURLToPath(import.meta.url); // Nombre del archivo actual
const __dirname = path.dirname(__filename); // Directorio del archivo actual

// Crear una instancia de Express
const app = express();
const puerto = process.env.PORT || 3000; // El puerto en el que se va a ejecutar el servidor

// Configuración para servir archivos estáticos y manejar JSON
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Caching de las peticiones (5 minutos)
const CACHE_TIEMPO = 5 * 60 * 1000; // 5 minutos
const cache = new Map();

// Función para obtener datos de la API
const obtenerDatosAPI = async (url) => {
  try {
    const respuesta = await fetch(url); // Realizar la solicitud HTTP
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    console.error(`Error al obtener datos de ${url}:`, error);
    throw error;
  }
};

// Función para obtener datos con caché
const obtenerConCache = async (url) => {
  const datosCache = cache.get(url); // Verificar si ya están los datos en caché
  if (datosCache?.timestamp > Date.now() - CACHE_TIEMPO) {
    return datosCache.data; // Si los datos no han expirado, devolverlos desde el caché
  }
  const datos = await obtenerDatosAPI(url); // Si no están en caché, obtenerlos de la API
  cache.set(url, { data: datos, timestamp: Date.now() }); // Guardar los datos en caché
  return datos;
};

// Función para obtener la información de la raza
const obtenerInfoRaza = (raza) => {
  const info = razasMapping[raza] ? infoRazas[razasMapping[raza].id] : infoRazas[raza];
  if (info) return info;

  const nombreFormateado = raza
    .split('-')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');

  return {
    nombre: nombreFormateado,
    origen: 'Origen desconocido',
    descripcion: 'Información no disponible para esta raza',
    infoOrigen: 'No tenemos información detallada sobre el origen de esta raza',
    esperanzaVida: 'No disponible',
  };
};

// Función para obtener la URL de la imagen de una raza
const obtenerUrlImagenRaza = (raza) => {
  const mapeoRaza = razasMapping[raza];
  if (!mapeoRaza) {
    return `https://dog.ceo/api/breed/${raza}/images/random`;
  }
  if (mapeoRaza.esSubraza) {
    return `https://dog.ceo/api/breed/${mapeoRaza.razaPrincipal}/${mapeoRaza.subraza}/images/random`;
  }
  return `https://dog.ceo/api/breed/${raza}/images/random`;
};

// Ruta principal (home)
app.get("/", async (req, res) => {
  try {
    const { message: imagenPerro } = await obtenerConCache("https://dog.ceo/api/breeds/image/random");
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                  <img src="${imagenPerro}" alt="Perro aleatorio" class="imagen-hero">
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

// Ruta para ver todas las razas
app.get("/razas", async (req, res) => {
  try {
    const { message: todasLasRazas } = await obtenerConCache("https://dog.ceo/api/breeds/list/all");
    const razasConInfoDetallada = Object.keys(razasMapping);
    const razasSinInfoDetallada = Object.keys(todasLasRazas).filter(
      (raza) => !razasConInfoDetallada.includes(raza)
    );

    // Promesas para obtener razas con información detallada
    const razasConInfoPromesas = razasConInfoDetallada.map(async (raza) => {
      try {
        const urlImagen = obtenerUrlImagenRaza(raza);
        const { message: imagen } = await obtenerConCache(urlImagen);
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

    // Promesas para obtener razas sin información detallada
    const razasSinInfoPromesas = razasSinInfoDetallada.slice(0, 20).map(async (raza) => {
      try {
        const urlImagen = obtenerUrlImagenRaza(raza);
        const { message: imagen } = await obtenerConCache(urlImagen);
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

    // Esperar las promesas y generar la respuesta
    const razasConInfoCompleta = await Promise.all(razasConInfoPromesas);
    const razasSinInfoCompleta = await Promise.all(razasSinInfoPromesas);

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Razas de Perros</title>
          <link rel="stylesheet" href="/styles/main.css">
        </head>
        <body>
          <div class="header">
            <h1>Razas de Perros</h1>
          </div>
          <div class="contenedor">
            <nav>
              <a href="/">Inicio</a> |
              <a href="/razas">Lista de Razas</a>
            </nav>
            <div class="razas">
              ${razasConInfoCompleta.map(raza => `
                <div class="raza">
                  <h3>${raza.nombre}</h3>
                  <img src="${raza.imagen}" alt="${raza.nombre}">
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error al cargar las razas");
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});
