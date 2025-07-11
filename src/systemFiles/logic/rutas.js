import path from 'path';
import { fileURLToPath } from 'url';
import clipboardy from 'clipboardy';

// Obtener la ruta del archivo actual
export function obtenerRutaRaiz() {
  const __filename = fileURLToPath(import.meta.url);
  const rutaRaiz = path.resolve(path.dirname(__filename), '../../../');
  return rutaRaiz;
}

export function obtenerRutaEspecifica(...segments) {
  return path.join(obtenerRutaRaiz(), ...segments);
}

export function copiarRutaAlPortapapeles(ruta) {
  const unidad = ruta[0];
  clipboardy.writeSync(`${unidad}: && cd "${ruta}"`);
}
