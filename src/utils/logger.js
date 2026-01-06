import chalk from 'chalk';

const tag = (label, color) =>
  color ? chalk[color](`[${label}]`) : `[${label}]`;

/** Muestra un tipo de icono al principio del texto */
export const log = {
  info: (msg) => console.log(tag('INFO', 'blue'), msg),
  ok:   (msg) => console.log(tag('OK', 'green'), msg),
  warn: (msg) => console.log(tag('WARN', 'yellow'), msg),
  err:  (msg) => console.error(tag('ERR', 'red'), msg),
};

