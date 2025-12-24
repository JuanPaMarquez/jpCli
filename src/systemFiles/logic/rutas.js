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

// Copiar ruta al portapapeles según el sistema operativo
export function copiarRutaAlPortapapeles(ruta) {
  const esWindows = process.platform === 'win32';

  if (esWindows) {
    const unidad = ruta[0];
    // Comando para Windows
    clipboardy.writeSync(`${unidad}: && cd "${ruta}"`);
  } else {
    // Linux / macOS: solo la ruta absoluta
    clipboardy.writeSync(`cd "${ruta}"`);
  }

  console.log(`Ruta copiada al portapapeles para ${esWindows ? 'Windows' : 'Linux/macOS'}:`, ruta);
}

