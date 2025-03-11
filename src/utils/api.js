const fetch = require("node-fetch");

const CACHE_TIEMPO = 5 * 60 * 1000; // 5 minutos
const cache = new Map();

const obtenerDatosAPI = async (url) => {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    console.error(`Error al obtener datos de ${url}:`, error);
    throw error;
  }
};

const obtenerConCache = async (url) => {
  const datosCache = cache.get(url);
  if (datosCache?.timestamp > Date.now() - CACHE_TIEMPO) {
    return datosCache.data;
  }
  const datos = await obtenerDatosAPI(url);
  cache.set(url, { data: datos, timestamp: Date.now() });
  return datos;
};

module.exports = {
  obtenerDatosAPI,
  obtenerConCache,
};
