import chalk from 'chalk';
import { log } from '../../utils/logger.js';

export function borrarPantalla() {
  console.clear();
}

function mostrarConfiguraciones() {
  console.log('='.repeat(50));
  console.log(chalk.green('[e] Configuraciones:'));
  console.log(chalk.yellow('[c] Crear tecnologia'));
  console.log(chalk.red('[q] Salir'));
};

export function mostrarError(error, respuestaError, nombreProyecto, rutaProyecto) {
  const errores = {
    proyectosVacios: 'No se encontraron proyectos. Por favor, verifica proyectos.json.',
    tecnologiaInvalida: 'No se ha seleccionado una tecnología válida.',
    numeroInvalido: '\nNÚMERO INVALIDO!',
    nombreProyectoVacio: 'El nombre del proyecto no puede estar vacío.',
    nombreTecnologiaVacio: 'El nombre de la tecnologia no puede estar vacío.',
    carpetaInvalida: (respuestaError) => `Error al verificar la carpeta: ${respuestaError}`,
    proyectoExistente: (nombreProyecto, rutaProyecto) => `El proyecto "${nombreProyecto}" ya existe en la ruta ${rutaProyecto}.`
  };

  if (respuestaError) {
		log.err(`${errores[error](respuestaError)}`);
    return;
  }

  if (nombreProyecto && rutaProyecto) {
		log.err(`${errores[error](nombreProyecto, rutaProyecto)}`);
    return;
  }

  log.err(`${chalk.red(errores[error])}`);
}

export function mostrarTecnologias(proyectos) {
  borrarPantalla();
  console.log('='.repeat(50));
  console.log(chalk.blue('Lista de proyectos:'));
  console.log('='.repeat(50));

  proyectos.forEach((proyecto, index) => {
    console.log(chalk.hex(proyecto.color).bold(`[${index + 1}] ${proyecto.tecnologia}`));
  });

  mostrarConfiguraciones();
};

export function mostrarProyectos(tech) {
  borrarPantalla();
  console.log('='.repeat(50));
  console.log(chalk.hex(tech.color)(` Tecnologia: ${tech.tecnologia.toUpperCase()}`));
  console.log('='.repeat(50));

  tech.proyectos.forEach((p, index) => {
    console.log(`  [${index + 1}] ${p.nombre}`);
  });
  console.log('='.repeat(50));
  console.log(chalk.green('[c] Crear proyecto'));
	console.log(chalk.yellow('[d] Eliminar proyecto'));
  console.log(chalk.red('[q] Salir'));
}


