import './style.css';

// Función para obtener datos de la API
async function fetchFromApi(endpoint) {
  try {
    const response = await fetch(`/api${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Renderizar la página principal
async function renderHome() {
  try {
    const data = await fetchFromApi('/');
    document.querySelector('#app').innerHTML = data;
  } catch (error) {
    console.error('Error rendering home:', error);
  }
}

// Renderizar la lista de razas
async function renderBreeds() {
  try {
    const data = await fetchFromApi('/razas');
    document.querySelector('#app').innerHTML = data;
  } catch (error) {
    console.error('Error rendering breeds:', error);
  }
}

// Renderizar detalles de una raza
async function renderBreedDetails(breed) {
  try {
    const data = await fetchFromApi(`/raza/${breed}`);
    document.querySelector('#app').innerHTML = data;
  } catch (error) {
    console.error('Error rendering breed details:', error);
  }
}

// Router simple
function handleRoute() {
  const path = window.location.pathname;
  
  if (path === '/') {
    renderHome();
  } else if (path === '/razas') {
    renderBreeds();
  } else if (path.startsWith('/raza/')) {
    const breed = path.split('/')[2];
    renderBreedDetails(breed);
  }
}

// Inicializar la aplicación
window.addEventListener('popstate', handleRoute);
handleRoute();
