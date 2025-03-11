# 🐕 Todo sobre tu Perro

Una aplicación web que te permite explorar diferentes razas de perros, ver imágenes aleatorias y obtener información detallada sobre cada raza.

Este proyecto utiliza la [Dog CEO API](https://dog.ceo/dog-api/), que proporciona:
- Imágenes aleatorias de perros
- Lista completa de razas
- Imágenes específicas por raza
  para poder accder a ella he necesitado una API KEY

Desarrollo Paso a Paso

Para comenzar el proyecto, seguimos estos pasos:

Crear la estructura de directorios

  Inicializar el proyecto:

  Instalamos vite
  
  Crear el package.jason con el comando npm init
  
  Crear las rutas con node.js  para la página principal, la página de búsqueda de razas de perros y la página de detalles de cada raza de perro.

  Crear archivos index , busqueda y detalle-raza que se usa para las diferentes acciones
  
  Crear un archivo server.js donde pondremos las constantes (objetos) necesarias para la aplicación
  para ver la información de las razas de perros y la información mas detallada que aparece en la página como el origen, descripción....

  Crear las funciones necesarias para obtener la información de las razas de perros y mostrarla en la página tambien en el server.js
  Se crean promesas para las razas que tiene informacion y para las que no
 

 Estructura del Proyecto

  Todo-sobre-tu-perro/
├── src/
│   └── server.js      # Servidor principal
├── package.json       # Dependencias y scripts
├── .env              # Variables de entorno
└── README.md         # Documentación



Para construir la aplicacion utilizo los siguientes comandos:
npm run build
npm run deploy

Para iniciarla
npm start: Inicia el servidor en modo producción
npm run dev: Inicia el servidor en modo desarrollo con recarga automática
