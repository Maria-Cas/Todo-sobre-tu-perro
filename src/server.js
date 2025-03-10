const express = require('express');
const axios = require('axios');
const app = express();
const puerto = 3000;
const path = require('path');

// Configuración básica
app.use(express.static(path.join(__dirname, '../public')));

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
            <title>${titulo} - Todo sobre tu perro</title>
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

        const html = generarHTML('Inicio', `
            <h2>Perro Aleatorio del Día</h2>
            <img src="${datos.message}" alt="Perro" class="imagen-principal">
            <div class="info">
                <h3>${info.nombre}</h3>
                <p><strong>Origen:</strong> ${info.origen}</p>
                <p>${info.descripcion}</p>
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
                        nombre: info ? info.nombre : raza,
                        imagen: imagenData.message,
                        ruta: raza
                    };
                } catch (error) {
                    console.error(`Error al obtener imagen para ${raza}:`, error);
                    return {
                        nombre: raza,
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
                        </div>
                    </a>
                `).join('')}
            </div>
        `);

        cache.razas = { data: html, tiempo: Date.now() };
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al cargar las razas');
    }
});

app.get('/raza/:nombre', async (req, res) => {
    try {
        const raza = req.params.nombre;
        const datos = await obtenerDatosAPI(`https://dog.ceo/api/breed/${raza}/images`);
        const imagenes = datos.message;
        const imagenPrincipal = imagenes[0];
        const imagenesGaleria = imagenes.slice(1, 4);
        const info = obtenerInfoRaza(raza) || {
            nombre: raza,
            origen: "Origen desconocido",
            descripcion: "Información no disponible",
            infoOrigen: "Información no disponible"
        };

        const html = generarHTML(`Raza: ${info.nombre}`, `
            <div class="detalle-raza">
                <h1>${info.nombre}</h1>
                
                <div class="info-principal">
                    <div class="imagen-principal-container">
                        <img src="${imagenPrincipal}" alt="${info.nombre}" class="imagen-principal">
                    </div>
                    <div class="info-contenido">
                        <div class="info">
                            <h2>Descripción</h2>
                            <p>${info.descripcion}</p>
                        </div>

                        <div class="info-origen">
                            <h2>Origen</h2>
                            <p><strong>${info.origen}</strong></p>
                            <p>${info.infoOrigen}</p>
                        </div>
                    </div>
                </div>

                <h2>Más fotos</h2>
                <div class="galeria-imagenes">
                    ${imagenesGaleria.map(img => `
                        <div class="imagen-contenedor">
                            <img src="${img}" alt="${info.nombre}" class="imagen-galeria">
                        </div>
                    `).join('')}
                </div>
            </div>
        `);

        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al cargar la raza');
    }
});

// Iniciar servidor
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
