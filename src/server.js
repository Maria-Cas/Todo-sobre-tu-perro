import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { razasMapping, infoRazas } from "./data/razas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const puerto = process.env.PORT || 3000;
const CACHE_TIEMPO = 5 * 60 * 1000; // 5 minutos

// Configuración
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Función para obtener la información de una raza
const obtenerInfoRaza = (raza) => {
  const info = razasMapping[raza] ? infoRazas[razasMapping[raza].id] : infoRazas[raza];
  if (info) return info;

  // Si no hay info, devuelve datos genéricos
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

// Función para obtener la URL de la API según el tipo de raza (principal o subraza)
const obtenerUrlImagenRaza = (raza) => {
  const mapeoRaza = razasMapping[raza];
  
  if (!mapeoRaza) {
    // Si no está en nuestro mapeo, asumimos que es una raza principal
    return `https://dog.ceo/api/breed/${raza}/images/random`;
  }
  
  if (mapeoRaza.esSubraza) {
    // Si es una subraza, usamos el formato razaPrincipal/subraza
    return `https://dog.ceo/api/breed/${mapeoRaza.razaPrincipal}/${mapeoRaza.subraza}/images/random`;
  } else {
    // Si es una raza principal
    return `https://dog.ceo/api/breed/${raza}/images/random`;
  }
};

// Rutas
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
    // Obtenemos todas las razas de la API
    const { message: todasLasRazas } = await obtenerConCache("https://dog.ceo/api/breeds/list/all");
    
    // Obtenemos la lista de razas con información detallada
    const razasConInfoDetallada = Object.keys(razasMapping);
    
    // Obtenemos razas sin información detallada (excluyendo las que ya tienen info)
    const razasSinInfoDetallada = Object.keys(todasLasRazas).filter(
      raza => !razasConInfoDetallada.includes(raza)
    );
    
    // Preparamos la información para cada raza con datos completos
    const razasConInfoPromesas = razasConInfoDetallada.map(async (raza) => {
      try {
        const urlImagen = obtenerUrlImagenRaza(raza);
        const { message: imagen } = await obtenerConCache(urlImagen);
        const info = obtenerInfoRaza(raza);
        return { nombre: info.nombre, imagen, raza };
      } catch (error) {
        console.error(`Error al obtener imagen para ${raza}:`, error.message);
        return {
          nombre: obtenerInfoRaza(raza).nombre,
          imagen: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",
          raza,
        };
      }
    });

    // Preparamos información para razas sin datos detallados (limitamos a 20 para no sobrecargar)
    const razasSinInfoPromesas = razasSinInfoDetallada.slice(0, 20).map(async (raza) => {
      try {
        const urlImagen = obtenerUrlImagenRaza(raza);
        const { message: imagen } = await obtenerConCache(urlImagen);
        const info = obtenerInfoRaza(raza);
        return { nombre: info.nombre, imagen, raza };
      } catch (error) {
        console.error(`Error al obtener imagen para ${raza}:`, error.message);
        return {
          nombre: obtenerInfoRaza(raza).nombre,
          imagen: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg",
          raza,
        };
      }
    });

    // Esperamos a que todas las promesas se resuelvan
    const razasConInfoCompleta = await Promise.all(razasConInfoPromesas);
    const razasSinInfoCompleta = await Promise.all(razasSinInfoPromesas);

    // Generamos el HTML para las tarjetas de razas con información detallada
    const tarjetasConInfoHTML = razasConInfoCompleta
      .map(
        ({ nombre, imagen, raza }) => `
          <a href="/raza/${raza}" class="tarjeta tarjeta-destacada">
            <div class="insignia-info">Información completa</div>
            <img src="${imagen}" alt="${nombre}" class="imagen" 
                 onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
            <div class="contenido">
              <h3>${nombre}</h3>
            </div>
          </a>
        `
      )
      .join("");

    // Generamos el HTML para las tarjetas de razas sin información detallada
    const tarjetasSinInfoHTML = razasSinInfoCompleta
      .map(
        ({ nombre, imagen, raza }) => `
          <a href="/raza/${raza}" class="tarjeta tarjeta-basica">
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
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Razas de Perros</title>
          <link rel="stylesheet" href="/styles/main.css">
          <style>
            .seccion-titulo {
              text-align: center;
              margin: 30px 0 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #f0f0f0;
              color: #444;
            }
            
            .cuadricula {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 20px;
              padding: 20px;
              margin-bottom: 40px;
            }
            
            .tarjeta {
              display: flex;
              flex-direction: column;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              text-decoration: none;
              color: #333;
              transition: transform 0.3s ease;
              background: #fff;
              position: relative;
            }
            
            .tarjeta:hover {
              transform: translateY(-5px);
            }
            
            .tarjeta-destacada {
              box-shadow: 0 6px 12px rgba(0,0,0,0.15);
              border: 2px solid #4CAF50;
            }
            
            .tarjeta-basica {
              opacity: 0.9;
            }
            
            .insignia-info {
              position: absolute;
              top: 10px;
              right: 10px;
              background-color: #4CAF50;
              color: white;
              padding: 5px 10px;
              border-radius: 20px;
              font-size: 0.7em;
              font-weight: bold;
            }
            
            .imagen {
              width: 100%;
              height: 200px;
              object-fit: cover;
            }
            
            .contenido {
              padding: 15px;
              text-align: center;
              background-color: #f9f9f9;
            }
            
            .contenido h3 {
              margin: 0;
              font-size: 1.2em;
              color: #444;
            }
          </style>
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
            
            <h2 class="seccion-titulo">Razas con información detallada</h2>
            <div class="cuadricula">
              ${tarjetasConInfoHTML}
            </div>
            
            <h2 class="seccion-titulo">Otras razas disponibles</h2>
            <div class="cuadricula">
              ${tarjetasSinInfoHTML}
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error al cargar las razas");
  }
});

app.get("/raza/:raza", async (req, res) => {
  try {
    const raza = req.params.raza;
    const info = obtenerInfoRaza(raza);
    
    // Construir URL para obtener todas las imágenes
    let urlImagenes;
    const mapeoRaza = razasMapping[raza];
    
    if (mapeoRaza && mapeoRaza.esSubraza) {
      // Si es una subraza, usamos formato razaPrincipal/subraza
      urlImagenes = `https://dog.ceo/api/breed/${mapeoRaza.razaPrincipal}/${mapeoRaza.subraza}/images`;
    } else {
      // Si es una raza principal o no está en nuestro mapeo
      urlImagenes = `https://dog.ceo/api/breed/${raza}/images`;
    }
    
    // Obtener imágenes
    const urlImagenRandom = obtenerUrlImagenRaza(raza);
    const { message: imagenRandom } = await obtenerConCache(urlImagenRandom);
    
    // Obtenemos todas las imágenes disponibles
    const { message: imagenes } = await obtenerConCache(urlImagenes);
    
    // Seleccionamos la imagen principal y galería
    const imagenPrincipal = imagenes[0] || imagenRandom || "https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg";
    const imagenesGaleria = imagenes.slice(1, 4).filter((img) => img);

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
