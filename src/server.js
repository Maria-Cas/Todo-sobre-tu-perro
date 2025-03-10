const express = require('express');
const axios = require('axios');
const app = express();
const puerto = 3000;

// Configuración básica
app.use(express.static('public'));

// Caché
const CACHE_TIEMPO = 5 * 60 * 1000; // 5 minutos
let cache = {
    inicio: { data: null, tiempo: 0 },
    razas: { data: null, tiempo: 0 }
};

// Datos de razas y sus orígenes
const razasInfo = {
    "husky": {
        nombre: "Husky Siberiano",
        origen: "Siberia, Rusia",
        descripcion: "Perro de trineo desarrollado por el pueblo Chukchi en el noreste de Siberia.",
        infoOrigen: "Siberia es una vasta región geográfica que abarca la mayor parte del norte de Asia. Su clima extremadamente frío ayudó a desarrollar la característica capa doble de pelo del Husky."
    },
    "germanshepherd": {
        nombre: "Pastor Alemán",
        origen: "Alemania",
        descripcion: "Desarrollado originalmente para pastoreo, se convirtió en un perro de trabajo versátil.",
        infoOrigen: "Alemania tiene una larga tradición de crianza de perros de trabajo. El Pastor Alemán fue desarrollado a finales del siglo XIX en varias regiones del país."
    },
    "labrador": {
        nombre: "Labrador Retriever",
        origen: "Terranova, Canadá",
        descripcion: "Originalmente utilizado por pescadores para recuperar redes y peces.",
        infoOrigen: "Terranova es una isla en la costa este de Canadá, conocida por su industria pesquera. El clima frío y las aguas heladas influyeron en el desarrollo del pelaje resistente al agua del Labrador."
    },
    "akita": {
        nombre: "Akita Inu",
        origen: "Japón",
        descripcion: "Perro de caza y guardián tradicional japonés.",
        infoOrigen: "Originario de la prefectura de Akita en Japón, esta región montañosa ayudó a desarrollar un perro fuerte y resistente. Es considerado un tesoro nacional en Japón."
    },
    "chihuahua": {
        nombre: "Chihuahua",
        origen: "México",
        descripcion: "La raza más pequeña del mundo, originaria del estado de Chihuahua.",
        infoOrigen: "El estado de Chihuahua es el más grande de México. Se cree que estos perros tienen conexión con antiguas razas Toltecas."
    },
    "bulldog": {
        nombre: "Bulldog Inglés",
        origen: "Inglaterra, Reino Unido",
        descripcion: "Originalmente criado para las peleas de toros, ahora es un perro de compañía.",
        infoOrigen: "Inglaterra desarrolló esta raza durante la época de las peleas de toros, una práctica ahora prohibida. La raza se ha transformado significativamente desde entonces."
    }
};

// Funciones auxiliares
async function obtenerDatosAPI(url) {
    try {
        const respuesta = await axios.get(url);
        return respuesta.data;
    } catch (error) {
        console.error('Error API:', error.message);
        throw error;
    }
}

function obtenerInfoRaza(raza) {
    return razasInfo[raza.toLowerCase()] || {
        nombre: raza,
        origen: "Origen desconocido",
        descripcion: "Información no disponible",
        infoOrigen: "No hay información detallada sobre el lugar de origen."
    };
}

function generarHTML(titulo, contenido) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${titulo}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .contenedor {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .cuadricula {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                .tarjeta {
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .imagen {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                }
                .info {
                    background: #fff3e0;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #ff9800;
                }
                .info-origen {
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #2196f3;
                }
                .etiqueta {
                    font-weight: bold;
                    color: #333;
                    display: block;
                    margin-bottom: 5px;
                }
                nav {
                    margin: 20px 0;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="contenedor">
                <nav>
                    <a href="/">Inicio</a> |
                    <a href="/razas">Lista de Razas</a>
                </nav>
                ${contenido}
            </div>
        </body>
        </html>
    `;
}

// Rutas
app.get('/', async (req, res) => {
    try {
        if (cache.inicio.data && Date.now() - cache.inicio.tiempo < CACHE_TIEMPO) {
            return res.send(cache.inicio.data);
        }

        const datos = await obtenerDatosAPI('https://dog.ceo/api/breeds/image/random');
        const raza = datos.message.split('/')[4];
        const info = obtenerInfoRaza(raza);

        const html = generarHTML('Perro Aleatorio', `
            <h1>Perro Aleatorio</h1>
            <div class="tarjeta">
                <img src="${datos.message}" alt="Perro" class="imagen">
                <div class="tarjeta-contenido">
                    <h3>${info.nombre}</h3>
                    <p class="origen">Origen: ${info.origen}</p>
                    <span class="ver-mas">Click para más información →</span>
                </div>
            </div>
        `);

        cache.inicio = { data: html, tiempo: Date.now() };
        res.send(html);
    } catch (error) {
        res.status(500).send('Error al cargar la página');
    }
});

app.get('/razas', async (req, res) => {
    try {
        if (cache.razas.data && Date.now() - cache.razas.tiempo < CACHE_TIEMPO) {
            return res.send(cache.razas.data);
        }

        const datos = await obtenerDatosAPI('https://dog.ceo/api/breeds/list/all');
        const razas = Object.keys(datos.message);
        
        const razasConImagenes = await Promise.all(
            razas.map(async (raza) => {
                try {
                    const imagenData = await obtenerDatosAPI(`https://dog.ceo/api/breed/${raza}/images/random`);
                    const info = obtenerInfoRaza(raza);
                    return {
                        nombre: info.nombre,
                        origen: info.origen,
                        imagen: imagenData.message,
                        ruta: raza
                    };
                } catch (error) {
                    console.error(`Error al obtener imagen para ${raza}:`, error);
                    return {
                        nombre: raza,
                        origen: "Origen desconocido",
                        imagen: 'https://via.placeholder.com/300x300?text=Imagen+No+Disponible',
                        ruta: raza
                    };
                }
            })
        );

        const html = generarHTML('Lista de Razas', `
            <h1>Razas de Perros</h1>
            <div class="cuadricula">
                ${razasConImagenes.map(raza => `
                    <a href="/raza/${raza.ruta}" class="tarjeta">
                        <img src="${raza.imagen}" alt="${raza.nombre}" class="imagen" loading="lazy">
                        <div class="tarjeta-contenido">
                            <h3>${raza.nombre}</h3>
                            <p class="origen">Origen: ${raza.origen}</p>
                            <span class="ver-mas">Click para más información →</span>
                        </div>
                    </a>
                `).join('')}
            </div>
        `);

        const htmlConEstilos = html.replace('</style>', `
                .tarjeta {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                    text-decoration: none;
                    color: inherit;
                }
                .tarjeta:hover {
                    transform: translateY(-5px);
                }
                .tarjeta-contenido {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 15px;
                    text-align: center;
                }
                .tarjeta h3 {
                    margin: 0;
                    font-size: 1.2em;
                    color: #ffd700;
                }
                .origen {
                    font-size: 0.9em;
                    margin: 5px 0;
                    color: #fff;
                }
                .ver-mas {
                    display: block;
                    font-size: 0.9em;
                    margin-top: 5px;
                    color: #90caf9;
                }
            </style>
        `);

        cache.razas = { data: htmlConEstilos, tiempo: Date.now() };
        res.send(htmlConEstilos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al cargar las razas');
    }
});

app.get('/raza/:nombre', async (req, res) => {
    try {
        const raza = req.params.nombre;
        const info = obtenerInfoRaza(raza);
        const datos = await obtenerDatosAPI(`https://dog.ceo/api/breed/${raza}/images`);
        const imagenes = datos.message.slice(0, 4);

        const html = generarHTML(`Raza: ${info.nombre}`, `
            <h1>${info.nombre}</h1>
            
            <div class="info">
                <span class="etiqueta">Descripción:</span>
                <p>${info.descripcion}</p>
            </div>

            <div class="info-origen">
                <span class="etiqueta">Origen: ${info.origen}</span>
                <p>${info.infoOrigen}</p>
            </div>

            <h2>Galería de Imágenes</h2>
            <div class="cuadricula">
                ${imagenes.map(img => `
                    <img src="${img}" alt="${info.nombre}" class="imagen">
                `).join('')}
            </div>
        `);

        res.send(html);
    } catch (error) {
        res.status(500).send('Error al cargar la raza');
    }
});

// Iniciar servidor
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
