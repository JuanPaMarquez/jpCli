import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function datosProyectos () {
  try {
    const __filename = fileURLToPath(import.meta.url); // Ruta completa del archivo index.js
    const __dirname = path.dirname(__filename); // Directorio del archivo index.js (src)
    
    const proyectosPath = path.join(__dirname, 'proyectos.json'); // Ruta completa del archivo proyectos.json
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
