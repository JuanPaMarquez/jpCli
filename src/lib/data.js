import fs from 'fs';
import { obtenerRutaEspecifica } from '../utils/funciones.js';

export function datosProyectos () {
  try {
    const proyectosPath = obtenerRutaEspecifica('src', 'lib', 'proyectos.json'); // Ruta completa del archivo proyectos.json
    console.log('📂 Cargando proyectos desde:', proyectosPath);
    const proyectos = fs.readFileSync(proyectosPath, 'utf8'); // Cargar proyectos desde el archivo JSON

    if (!proyectos) {
      console.error('❌ No se encontraron proyectos en la carpeta lib.');
      return [];
    }

    return JSON.parse(proyectos);
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
    return [];
  }
}
