export function validarNumero(valor, catalogo) {
  const numero = parseInt(valor);
  if (isNaN(numero) || numero < 1 || numero > catalogo.length) {
    return false;
  }
  return true;
}