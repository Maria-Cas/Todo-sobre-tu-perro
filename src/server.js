const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const puerto = 3000;
const CACHE_TIEMPO = 5 * 60 * 1000; // 5 minutos
const cache = { razas: {}, inicio: {} };

// Configuración
app.use(express.static(path.join(__dirname, '../public')));

// Funciones auxiliares
const obtenerDatosAPI = async (url) => {
    const respuesta = await axios.get(url);
    return respuesta.data;
};

const generarHTML = (titulo, contenido) => `
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

// Mapeo de nombres de razas de la API a nuestras claves
const razasMapping = {
    'retriever-labrador': 'labrador',
    'shepherd-german': 'german',
    'retriever-golden': 'golden',
    'bulldog': 'bulldog',
    'poodle': 'poodle',
    'beagle': 'beagle',
    // Añadir más razas comunes
    'husky': 'husky',
    'rottweiler': 'rottweiler',
    'boxer': 'boxer',
    'chihuahua': 'chihuahua',
    'doberman': 'doberman',
    'corgi': 'corgi'
};

const infoRazas = {
    'labrador': {
        nombre: 'Labrador Retriever',
        origen: 'Canadá',
        descripcion: 'El Labrador Retriever es una de las razas más populares del mundo. Son perros amigables, activos y excelentes con los niños.',
        infoOrigen: 'Originalmente criados para ayudar a los pescadores, estos perros son excelentes nadadores y tienen un pelaje resistente al agua.',
        esperanzaVida: '10-12 años'
    },
    'german': {
        nombre: 'Pastor Alemán',
        origen: 'Alemania',
        descripcion: 'El Pastor Alemán es conocido por su inteligencia, lealtad y capacidad de trabajo. Son excelentes perros de servicio y familia.',
        infoOrigen: 'Desarrollados originalmente como perros pastores, hoy en día son utilizados en múltiples roles, incluyendo policía y rescate.',
        esperanzaVida: '9-13 años'
    },
    'golden': {
        nombre: 'Golden Retriever',
        origen: 'Escocia',
        descripcion: 'El Golden Retriever es conocido por su personalidad amigable y su hermoso pelaje dorado. Son excelentes perros de familia.',
        infoOrigen: 'Fueron criados originalmente para la recuperación de presas en la caza, especialmente en el agua.',
        esperanzaVida: '10-12 años'
    },
    'bulldog': {
        nombre: 'Bulldog Inglés',
        origen: 'Inglaterra',
        descripcion: 'El Bulldog es un perro tranquilo y amigable, conocido por su apariencia distintiva y su naturaleza dócil.',
        infoOrigen: 'Originalmente criados para la lucha con toros, hoy en día son perros de compañía pacíficos y cariñosos.',
        esperanzaVida: '8-10 años'
    },
    'poodle': {
        nombre: 'Caniche',
        origen: 'Francia',
        descripcion: 'El Caniche es una de las razas más inteligentes. Son activos, elegantes y vienen en diferentes tamaños.',
        infoOrigen: 'Aunque se asocian con la elegancia francesa, originalmente fueron perros de caza de agua.',
        esperanzaVida: '12-15 años'
    },
    'beagle': {
        nombre: 'Beagle',
        origen: 'Inglaterra',
        descripcion: 'Los Beagles son perros alegres y curiosos, conocidos por su excelente sentido del olfato y su naturaleza amigable.',
        infoOrigen: 'Fueron criados para la caza de conejos y otras presas pequeñas en jauría.',
        esperanzaVida: '12-15 años'
    },
    'husky': {
        nombre: 'Husky Siberiano',
        origen: 'Siberia',
        descripcion: 'El Husky Siberiano es un perro de trabajo resistente, conocido por su pelaje denso y su personalidad amigable.',
        infoOrigen: 'Desarrollados por el pueblo Chukchi para el trineo y la compañía en el frío clima siberiano.',
        esperanzaVida: '12-14 años'
    },
    'rottweiler': {
        nombre: 'Rottweiler',
        origen: 'Alemania',
        descripcion: 'El Rottweiler es un perro fuerte y leal, excelente como guardián y compañero de familia.',
        infoOrigen: 'Originalmente utilizados para arrear ganado y tirar de carretas de carniceros en la ciudad de Rottweil.',
        esperanzaVida: '8-10 años'
    },
    'boxer': {
        nombre: 'Boxer',
        origen: 'Alemania',
        descripcion: 'El Boxer es un perro juguetón y energético, excelente con los niños y muy protector con su familia.',
        infoOrigen: 'Descendiente del extinto Bullenbeisser, fue desarrollado en Alemania a finales del siglo XIX.',
        esperanzaVida: '10-12 años'
    },
    'chihuahua': {
        nombre: 'Chihuahua',
        origen: 'México',
        descripcion: 'El Chihuahua es el perro más pequeño del mundo, conocido por su personalidad valiente y su lealtad.',
        infoOrigen: 'Originario del estado de Chihuahua, México, tiene una historia que se remonta a los perros precolombinos.',
        esperanzaVida: '12-20 años'
    },
    'doberman': {
        nombre: 'Doberman',
        origen: 'Alemania',
        descripcion: 'El Doberman es un perro elegante y atlético, conocido por su inteligencia y lealtad.',
        infoOrigen: 'Creado por Karl Friedrich Louis Dobermann, quien buscaba un perro de protección personal.',
        esperanzaVida: '10-13 años'
    },
    'corgi': {
        nombre: 'Welsh Corgi',
        origen: 'Gales',
        descripcion: 'El Corgi es un perro pequeño pero robusto, conocido por su personalidad alegre y su inteligencia.',
        infoOrigen: 'Originalmente criado para pastorear ganado en Gales, es famoso por ser la raza favorita de la Reina Isabel II.',
        esperanzaVida: '12-14 años'
    }
};

const obtenerInfoRaza = (raza) => {
    // Primero intentamos obtener la raza directamente
    let info = infoRazas[raza];
    
    // Si no encontramos la raza, intentamos usar el mapping
    if (!info) {
        const razaMapeada = razasMapping[raza];
        info = infoRazas[razaMapeada];
    }

    // Si aún no encontramos información, devolvemos información genérica
    if (!info) {
        // Convertir el nombre de la raza a un formato más legible
        const nombreFormateado = raza
            .split('-')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');

        return {
            nombre: nombreFormateado,
            origen: "Origen desconocido",
            descripcion: "Información no disponible para esta raza",
            infoOrigen: "No tenemos información detallada sobre el origen de esta raza",
            esperanzaVida: "No disponible"
        };
    }

    return info;
};

// Rutas
app.get('/', async (req, res) => {
    try {
        const { message: imagenPerro } = await obtenerDatosAPI('https://dog.ceo/api/breeds/image/random');
        res.send(generarHTML('Inicio', `
            <div class="pagina-inicio">
                <div class="hero-section">
                    <div class="hero-content">
                        <h1>Descubre el Mundo de los Perros</h1>
                        <p>Explora nuestra colección de razas caninas y conoce más sobre estos maravillosos compañeros</p>
                        <a href="/razas" class="boton-principal">Ver Todas las Razas</a>
                    </div>
                    <div class="hero-imagen">
                        <img src="${imagenPerro}" alt="Perro feliz" class="imagen-hero">
                    </div>
                </div>
            </div>
        `));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al cargar la página');
    }
});

app.get('/razas', async (req, res) => {
    try {
        if (cache.razas.data && Date.now() - cache.razas.tiempo < CACHE_TIEMPO) {
            return res.send(cache.razas.data);
        }

        const { message: razas } = await obtenerDatosAPI('https://dog.ceo/api/breeds/list/all');
        
        // Obtener imágenes para cada raza
        const razasPromesas = Object.keys(razas).map(async raza => {
            try {
                const { message: imagenes } = await obtenerDatosAPI(`https://dog.ceo/api/breed/${raza}/images/random`);
                const info = obtenerInfoRaza(raza);
                return {
                    nombre: info.nombre,
                    imagen: imagenes,
                    raza: raza
                };
            } catch (error) {
                console.error(`Error al obtener imagen para ${raza}:`, error);
                return {
                    nombre: info.nombre,
                    imagen: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg',
                    raza: raza
                };
            }
        });

        const razasConImagenes = await Promise.all(razasPromesas);
        
        const tarjetasHTML = razasConImagenes.map(({ nombre, imagen, raza }) => `
            <a href="/raza/${raza}" class="tarjeta">
                <img src="${imagen}" alt="${nombre}" class="imagen" 
                     onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                <div class="tarjeta-contenido">
                    <h3>${nombre}</h3>
                </div>
            </a>
        `).join('');

        const html = generarHTML('Razas de Perros', `
            <div class="cuadricula">
                ${tarjetasHTML}
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
        const { message: imagenes } = await obtenerDatosAPI(`https://dog.ceo/api/breed/${raza}/images`);
        const info = obtenerInfoRaza(raza);

        // Asegurarnos de que tenemos imágenes y usar una imagen de respaldo si no hay
        const imagenPrincipal = imagenes[0] || 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg';
        const imagenesGaleria = imagenes.slice(1, 4).filter(img => img); // Filtrar imágenes nulas

        res.send(generarHTML(`Raza: ${info.nombre}`, `
            <div class="detalle-raza">
                <h1>${info.nombre}</h1>
                <div class="info-principal">
                    <div class="imagen-principal-container">
                        <img src="${imagenPrincipal}" alt="${info.nombre}" class="imagen-principal"
                             onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                    </div>
                    <div class="info-contenido">
                        <div class="info">
                            <h2>Descripción</h2>
                            <p>${info.descripcion}</p>
                            <div class="esperanza-vida">
                                <h3>Esperanza de Vida</h3>
                                <p><strong>${info.esperanzaVida}</strong></p>
                            </div>
                        </div>
                        <div class="info-origen">
                            <h2>Origen</h2>
                            <p><strong>${info.origen}</strong></p>
                            <p>${info.infoOrigen}</p>
                        </div>
                    </div>
                </div>
                ${imagenesGaleria.length > 0 ? `
                    <h2>Más fotos</h2>
                    <div class="galeria-imagenes">
                        ${imagenesGaleria.map(img => `
                            <div class="imagen-contenedor">
                                <img src="${img}" alt="${info.nombre}" class="imagen-galeria"
                                     onerror="this.src='https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg'">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al cargar la raza');
    }
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
