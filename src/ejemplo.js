const DogAPI = require('./dogApi');

// Crear una instancia de la API
const dogApi = new DogAPI('TU_API_KEY'); // Reemplaza con tu API key

async function ejemplos() {
    try {
        // Obtener lista de razas
        console.log('Obteniendo lista de razas...');
        const razas = await dogApi.getRazas();
        console.log('Primeras 3 razas:', razas.slice(0, 3));

        // Buscar una raza específica
        console.log('\nBuscando información sobre el Husky...');
        const busqueda = await dogApi.buscarRaza('Husky');
        console.log('Resultados de búsqueda:', busqueda);

        // Obtener imágenes aleatorias
        console.log('\nObteniendo imágenes aleatorias...');
        const imagenes = await dogApi.getImagenesAleatorias(2);
        console.log('URLs de imágenes:', imagenes.map(img => img.url));

        // Obtener imágenes de una raza específica
        if (busqueda.length > 0) {
            console.log('\nObteniendo imágenes de Husky...');
            const imagenesHusky = await dogApi.getImagenesPorRaza(busqueda[0].id);
            console.log('URLs de imágenes de Husky:', imagenesHusky.map(img => img.url));
        }
    } catch (error) {
        console.error('Error en los ejemplos:', error);
    }
}

ejemplos();
