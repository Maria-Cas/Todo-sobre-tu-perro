const axios = require('axios');
require('dotenv').config();

class DogAPI {
    constructor(apiKey = process.env.DOG_API_KEY) {
        if (!apiKey) {
            throw new Error('API key no encontrada. Asegúrate de tener un archivo .env con DOG_API_KEY=tu_api_key');
        }
        this.apiKey = apiKey;
        this.baseURL = 'https://api.thedogapi.com/v1';
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'x-api-key': this.apiKey
            }
        });
        
        // Añadir interceptor para manejar errores
        this.client.interceptors.response.use(
            response => response,
            error => {
                if (error.response) {
                    console.error('Error de respuesta:', {
                        status: error.response.status,
                        headers: error.response.headers,
                        data: error.response.data
                    });
                }
                throw error;
            }
        );
    }

    // Obtener una lista de razas de perros
    async getRazas() {
        try {
            console.log('Obteniendo razas...');
            const response = await this.client.get('/breeds', {
                params: {
                    limit: 10 // Limitamos a 10 razas inicialmente para evitar sobrecarga
                }
            });
            console.log('Razas obtenidas exitosamente');
            return response.data;
        } catch (error) {
            console.error('Error al obtener razas:', error.message);
            if (error.response && error.response.status === 429) {
                throw new Error('Demasiadas peticiones a la API. Por favor, espera un momento y vuelve a intentarlo.');
            }
            throw error;
        }
    }

    // Buscar razas por nombre
    async buscarRaza(nombre) {
        try {
            const response = await this.client.get('/breeds/search', {
                params: { q: nombre }
            });
            return response.data;
        } catch (error) {
            console.error('Error al buscar raza:', error.message);
            throw error;
        }
    }

    // Obtener imágenes aleatorias de perros
    async getImagenesAleatorias(limit = 1) {
        try {
            const response = await this.client.get('/images/search', {
                params: { 
                    limit,
                    size: 'med' // Añadimos tamaño medio para optimizar
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener imágenes:', error.message);
            throw error;
        }
    }

    // Obtener imágenes por raza
    async getImagenesPorRaza(breedId) {
        try {
            const response = await this.client.get('/images/search', {
                params: {
                    breed_id: breedId,
                    limit: 5,
                    size: 'med'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener imágenes por raza:', error.message);
            throw error;
        }
    }
}

module.exports = DogAPI;
