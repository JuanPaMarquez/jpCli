import { obtenerRutaEspecifica } from '../logic/rutas.js';
import fs from 'fs';

export function crearCarpeta(tecnologiaSeleccionada, nombreProyecto, rutaProyecto, proyectos) {
 
  const nuevoProyecto = {
    id: tecnologiaSeleccionada.proyectos.length + 1,
    nombre: nombreProyecto,
    ruta: rutaProyecto
  };

  tecnologiaSeleccionada.proyectos.push(nuevoProyecto);

  fs.mkdirSync(rutaProyecto, { recursive: true });
  fs.writeFileSync(obtenerRutaEspecifica('src', 'systemFiles', 'data', 'proyectos.json'), JSON.stringify(proyectos, null, 2));
}