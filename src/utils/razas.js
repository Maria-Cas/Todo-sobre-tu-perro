import { razasMapping, infoRazas } from "../data/razas.js";

export const obtenerInfoRaza = (raza) => {
  const info = infoRazas[razasMapping[raza]] || infoRazas[raza];
  if (info) return info;

  const nombreFormateado = raza
    .split("-")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

  return {
    nombre: nombreFormateado,
    origen: "Origen desconocido",
    descripcion: "Información no disponible para esta raza",
    infoOrigen: "No tenemos información detallada sobre el origen de esta raza",
    esperanzaVida: "No disponible",
  };
};
