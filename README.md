# API Cliente para TheDogAPI

Este proyecto proporciona un cliente API en JavaScript para interactuar con TheDogAPI.com, permitiéndote obtener información sobre diferentes razas de perros e imágenes.

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto y añade tu API key de TheDogAPI:
```
DOG_API_KEY=tu_api_key_aqui
```

Puedes obtener una API key gratuita en [TheDogAPI](https://thedogapi.com/).

## Uso

El cliente API proporciona los siguientes métodos:

- `getRazas()`: Obtiene una lista de todas las razas de perros
- `buscarRaza(nombre)`: Busca razas por nombre
- `getImagenesAleatorias(limit)`: Obtiene imágenes aleatorias de perros
- `getImagenesPorRaza(breedId)`: Obtiene imágenes de una raza específica

### Ejemplo de uso

```javascript
const DogAPI = require('./src/dogApi');
const dogApi = new DogAPI(); // La API key se tomará del archivo .env

// Obtener todas las razas
const razas = await dogApi.getRazas();

// Buscar una raza específica
const huskies = await dogApi.buscarRaza('Husky');

// Obtener imágenes aleatorias
const imagenes = await dogApi.getImagenesAleatorias(3);
```

Puedes ver más ejemplos en el archivo `src/ejemplo.js`.

## Dependencias

- axios: Para realizar peticiones HTTP
- dotenv: Para manejar variables de entorno
# Todo-sobre-tu-perro
