# 🐕 Todo sobre tu Perro

Una aplicación web que te permite explorar diferentes razas de perros, ver imágenes aleatorias y obtener información detallada sobre cada raza.

## 📋 Características

- 🎲 Ver imágenes aleatorias de perros
- 📱 Interfaz responsive y moderna
- 🔍 Buscador de razas en tiempo real
- 🌍 Nombres de razas en español
- 📸 Galería de imágenes por raza
- 🚀 Caché para mejor rendimiento

## 🛠️ Tecnologías Utilizadas

- Instalado Node.js junto con express como framework del servidor
- Dog CEO API que es una libreria para obtener información de las razas de perros

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/Todo-sobre-tu-perro.git
cd Todo-sobre-tu-perro
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

4. Abre tu navegador y visita:
```
http://localhost:3000
```

## 🚀 Uso

### Página Principal
- Muestra una imagen aleatoria de un perro
- Indica la raza del perro mostrado
- Permite navegar a la lista de razas

### Lista de Razas
- Muestra todas las razas disponibles con imágenes
- Búsqueda en tiempo real de razas
- Cada tarjeta muestra:
  - Imagen representativa de la raza
  - Nombre de la raza en español

### Detalles de Raza
- Muestra información específica de la raza seleccionada
- Galería de 4 imágenes aleatorias de la raza
- Navegación fácil entre secciones

## 📁 Estructura del Proyecto

```
Todo-sobre-tu-perro/
├── src/
│   └── server.js      # Servidor principal
├── package.json       # Dependencias y scripts
├── .env              # Variables de entorno
└── README.md         # Documentación
```

## 🔧 Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática

## 📚 API Utilizada

Este proyecto utiliza la [Dog CEO API](https://dog.ceo/dog-api/), que proporciona:
- Imágenes aleatorias de perros
- Lista completa de razas
- Imágenes específicas por raza








Implemetantado  sistema de manejo de errores con un Middleware