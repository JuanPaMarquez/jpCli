import fs from 'fs';

export function esNumeroValido(valor, catalogo) {
  const numero = parseInt(valor);
  if (isNaN(numero) || numero < 1 || numero > catalogo.length) {
    return false;
  }
  return true;
}

export function hayProyectos(proyectos) {
  return Array.isArray(proyectos) && proyectos.length > 0;
}

export function existeCarpeta(ruta) {
  try {
    return fs.existsSync(ruta);
  } catch {
    return false;
  }
}

export function esColorHexValido(color) {
	const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
	return hexRegex.test(color);
}

