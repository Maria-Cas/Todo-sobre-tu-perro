const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Traducciones de razas de perros
const traduccionesRazas = {
    "affenpinscher": "Affenpinscher",
    "african": "Africano",
    "airedale": "Airedale Terrier",
    "akita": "Akita",
    "appenzeller": "Appenzeller",
    "australian": "Pastor Australiano",
    "basenji": "Basenji",
    "beagle": "Beagle",
    "bluetick": "Bluetick Coonhound",
    "borzoi": "Borzoi",
    "bouvier": "Bouvier des Flandres",
    "boxer": "Boxer",
    "brabancon": "Petit Brabançon",
    "briard": "Briard",
    "buhund": "Buhund Noruego",
    "bulldog": "Bulldog",
    "bullterrier": "Bull Terrier",
    "cattledog": "Perro Boyero Australiano",
    "chihuahua": "Chihuahua",
    "chow": "Chow Chow",
    "clumber": "Clumber Spaniel",
    "cockapoo": "Cockapoo",
    "collie": "Collie",
    "coonhound": "Coonhound",
    "corgi": "Corgi",
    "cotondetulear": "Cotón de Tulear",
    "dachshund": "Dachshund (Teckel)",
    "dalmatian": "Dálmata",
    "dane": "Gran Danés",
    "deerhound": "Deerhound Escocés",
    "dhole": "Dhole",
    "dingo": "Dingo",
    "doberman": "Doberman",
    "elkhound": "Elkhound Noruego",
    "entlebucher": "Entlebucher",
    "eskimo": "Perro Esquimal",
    "finnish": "Finlandés",
    "frise": "Bichón Frisé",
    "germanshepherd": "Pastor Alemán",
    "greyhound": "Galgo",
    "groenendael": "Pastor Belga Groenendael",
    "havanese": "Bichón Habanero",
    "hound": "Sabueso",
    "husky": "Husky Siberiano",
    "keeshond": "Keeshond",
    "kelpie": "Kelpie Australiano",
    "komondor": "Komondor",
    "kuvasz": "Kuvasz",
    "labradoodle": "Labradoodle",
    "labrador": "Labrador Retriever",
    "leonberg": "Leonberger",
    "lhasa": "Lhasa Apso",
    "malamute": "Alaskan Malamute",
    "malinois": "Pastor Belga Malinois",
    "maltese": "Maltés",
    "mastiff": "Mastín",
    "mexicanhairless": "Perro Pelón Mexicano",
    "mix": "Mestizo",
    "mountain": "Perro de Montaña",
    "newfoundland": "Terranova",
    "otterhound": "Otterhound",
    "ovcharka": "Ovcharka del Cáucaso",
    "papillon": "Papillon",
    "pekinese": "Pequinés",
    "pembroke": "Corgi Galés de Pembroke",
    "pinscher": "Pinscher",
    "pitbull": "Pit Bull",
    "pointer": "Pointer",
    "pomeranian": "Pomerania",
    "poodle": "Caniche",
    "pug": "Pug",
    "puggle": "Puggle",
    "pyrenees": "Perro de los Pirineos",
    "redbone": "Redbone Coonhound",
    "retriever": "Retriever",
    "ridgeback": "Rhodesian Ridgeback",
    "rottweiler": "Rottweiler",
    "saluki": "Saluki",
    "samoyed": "Samoyedo",
    "schipperke": "Schipperke",
    "schnauzer": "Schnauzer",
    "setter": "Setter",
    "sheepdog": "Perro Pastor",
    "shiba": "Shiba Inu",
    "shihtzu": "Shih Tzu",
    "spaniel": "Spaniel",
    "springer": "Springer Spaniel",
    "stbernard": "San Bernardo",
    "terrier": "Terrier",
    "tervuren": "Pastor Belga Tervuren",
    "vizsla": "Vizsla",
    "waterdog": "Perro de Agua",
    "weimaraner": "Weimaraner",
    "whippet": "Whippet",
    "wolfhound": "Lobero Irlandés"
};

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
    
    if (timeSinceLastRequest < 1000) {
        await wait(1000 - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
    return axios(url, options);
}

// Función para traducir el nombre de la raza
function traducirRaza(nombre) {
    return traduccionesRazas[nombre.toLowerCase()] || nombre;
}

// Ruta para obtener una sola imagen aleatoria
app.get('/', async (req, res) => {
    try {
        if (imageCache && (Date.now() - imageCache.timestamp) < 30000) {
            return res.send(imageCache.html);
        }

        const response = await makeRequest('https://dog.ceo/api/breeds/image/random');
        const breedName = response.data.message.split('/')[4]; // Extraer nombre de la raza de la URL
        
        const html = `
            <h1>Imagen aleatoria de un perro</h1>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .nav-links {
                    margin: 20px 0;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                    margin-right: 15px;
                }
                a:hover {
                    text-decoration: underline;
                }
                .breed-info {
                    margin: 15px 0;
                    padding: 10px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                }
            </style>
            <div class="container">
                <img src="${response.data.message}" alt="Perro aleatorio">
                <div class="breed-info">
                    <p>Raza: ${traducirRaza(breedName)}</p>
                </div>
                <div class="nav-links">
                    <a href="/razas">Ver lista de razas</a>
                    <a href="/">Ver otra imagen</a>
                </div>
            </div>
        `;

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
        if (razasCache && (Date.now() - razasCache.timestamp) < 300000) {
            return res.send(razasCache.html);
        }

        const response = await makeRequest('https://dog.ceo/api/breeds/list/all');
        const breeds = response.data.message;
        
        // Obtener una imagen para cada raza
        const breedsWithImages = await Promise.all(
            Object.keys(breeds).map(async (breed) => {
                try {
                    const imageResponse = await makeRequest(`https://dog.ceo/api/breed/${breed}/images/random`);
                    return {
                        name: breed,
                        image: imageResponse.data.message
                    };
                } catch (error) {
                    console.error(`Error getting image for ${breed}:`, error.message);
                    return {
                        name: breed,
                        image: 'https://via.placeholder.com/200x200?text=No+Image'
                    };
                }
            })
        );
        
        const html = `
            <h1>Razas de perros</h1>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .breeds-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .breed-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                    cursor: pointer;
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                }
                .breed-card:hover {
                    transform: translateY(-5px);
                }
                .breed-name {
                    text-transform: capitalize;
                    color: #333;
                    margin: 10px 0;
                    text-align: center;
                }
                .breed-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-bottom: 10px;
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
                .search-container {
                    margin: 20px;
                    text-align: center;
                }
                #searchInput {
                    padding: 10px;
                    width: 300px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }
                .loading {
                    text-align: center;
                    padding: 20px;
                    font-size: 18px;
                    color: #666;
                }
            </style>
            <div class="nav-links">
                <a href="/">Ver imagen aleatoria</a>
            </div>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Buscar raza..." oninput="filterBreeds(this.value)">
            </div>
            <div class="breeds-list" id="breedsList">
                ${breedsWithImages.map(breed => `
                    <a href="/raza/${breed.name}" class="breed-card">
                        <img src="${breed.image}" alt="${traducirRaza(breed.name)}" class="breed-image" loading="lazy">
                        <h3 class="breed-name">${traducirRaza(breed.name)}</h3>
                    </a>
                `).join('')}
            </div>
            <script>
                function filterBreeds(searchTerm) {
                    const cards = document.querySelectorAll('.breed-card');
                    searchTerm = searchTerm.toLowerCase();
                    
                    cards.forEach(card => {
                        const breedName = card.querySelector('.breed-name').textContent.toLowerCase();
                        if (breedName.includes(searchTerm)) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }

                // Cargar imágenes de forma lazy
                document.addEventListener('DOMContentLoaded', function() {
                    if ('loading' in HTMLImageElement.prototype) {
                        const images = document.querySelectorAll('img[loading="lazy"]');
                        images.forEach(img => {
                            img.src = img.src;
                        });
                    }
                });
            </script>
        `;

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

// Ruta para ver detalles de una raza específica
app.get('/raza/:nombre', async (req, res) => {
    try {
        const nombre = req.params.nombre;
        const nombreTraducido = traducirRaza(nombre);
        
        const response = await makeRequest(`https://dog.ceo/api/breed/${nombre}/images`);
        const imagenes = response.data.message;
        
        const imagenesAleatorias = imagenes
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        const html = `
            <h1>Raza: ${nombreTraducido}</h1>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                .dog-image {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .nav-links {
                    margin: 20px 0;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                    margin-right: 15px;
                }
                a:hover {
                    text-decoration: underline;
                }
                .info-section {
                    margin: 20px 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                }
            </style>
            <div class="container">
                <div class="nav-links">
                    <a href="/">Inicio</a>
                    <a href="/razas">Volver a la lista de razas</a>
                </div>
                
                <div class="info-section">
                    <h2>Información sobre ${nombreTraducido}</h2>
                    <p>Esta es una muestra de imágenes de perros de la raza ${nombreTraducido}.</p>
                </div>

                <div class="images-grid">
                    ${imagenesAleatorias.map(imagen => `
                        <img src="${imagen}" alt="Perro ${nombreTraducido}" class="dog-image">
                    `).join('')}
                </div>
            </div>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error:', error.message);
        res.send(`
            <h1>Error</h1>
            <p>Hubo un problema al obtener la información de la raza ${traducirRaza(req.params.nombre)}.</p>
            <p><a href="/razas">Volver a la lista de razas</a></p>
        `);
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
