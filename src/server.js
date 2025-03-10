const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Cache para almacenar resultados
let imageCache = null;
let razasCache = null;
let lastRequestTime = 0;

// Función para esperar entre peticiones
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para asegurar que hay suficiente tiempo entre peticiones
async function makeRequest(url, options = {}) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < 1000) { // Esperar al menos 1 segundo entre peticiones
        await wait(1000 - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
    return axios(url, options);
}

// Ruta para obtener una sola imagen aleatoria
app.get('/', async (req, res) => {
    try {
        // Usar caché si existe y tiene menos de 30 segundos
        if (imageCache && (Date.now() - imageCache.timestamp) < 30000) {
            return res.send(imageCache.html);
        }

        // Hacer la petición sin API key
        const response = await makeRequest('https://dog.ceo/api/breeds/image/random');
        
        // Crear HTML
        const html = `
            <h1>Imagen aleatoria de un perro</h1>
            <img src="${response.data.message}" alt="Perro aleatorio" style="max-width: 500px">
            <p><a href="/razas">Ver lista de razas</a></p>
            <p><a href="/">Ver otra imagen</a></p>
        `;

        // Guardar en caché
        imageCache = {
            html,
            timestamp: Date.now()
        };

        res.send(html);
    } catch (error) {
        console.error('Error:', error.message);
        res.send(`
            <h1>Error</h1>
            <p>Hubo un problema al obtener la imagen. Por favor, intenta de nuevo en unos momentos.</p>
            <p><a href="/">Reintentar</a></p>
        `);
    }
});

// Ruta para ver razas
app.get('/razas', async (req, res) => {
    try {
        // Usar caché si existe y tiene menos de 5 minutos
        if (razasCache && (Date.now() - razasCache.timestamp) < 300000) {
            return res.send(razasCache.html);
        }

        // Hacer la petición sin API key
        const response = await makeRequest('https://dog.ceo/api/breeds/list/all');
        const breeds = response.data.message;
        
        // Crear HTML
        const html = `
            <h1>Razas de perros</h1>
            <style>
                .breeds-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .breed-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }
                .breed-name {
                    text-transform: capitalize;
                    color: #333;
                    margin: 0;
                }
                .nav-links {
                    margin: 20px;
                    text-align: center;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
            <div class="nav-links">
                <a href="/">Ver imagen aleatoria</a>
            </div>
            <div class="breeds-list">
                ${Object.keys(breeds).map(breed => `
                    <div class="breed-card">
                        <h3 class="breed-name">${breed}</h3>
                    </div>
                `).join('')}
            </div>
        `;

        // Guardar en caché
        razasCache = {
            html,
            timestamp: Date.now()
        };

        res.send(html);
    } catch (error) {
        console.error('Error:', error.message);
        res.send(`
            <h1>Error</h1>
            <p>Hubo un problema al obtener las razas. Por favor, intenta de nuevo en unos momentos.</p>
            <p><a href="/razas">Reintentar</a></p>
        `);
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
