import chalk from 'chalk';
import readline from 'readline';
import { esNumeroValido, existeCarpeta } from '../logic/validadores.js';
import { obtenerRutaRaiz, copiarRutaAlPortapapeles } from '../logic/rutas.js';
import { 
  borrarPantalla, 
  mostrarError, 
} from './mostrar.js';
import { cargarProyectos, iniciarSistema } from '../main.js';
import { borrarProyecto, crearCarpeta, guardarTecnologia } from '../logic/proyectos.js';
import path from 'path';
import { datosProyectos } from '../data/data.js';
import { log } from '../../utils/logger.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function confirmarEliminarProyecto(tecnologiaSeleccionada) {
  rl.question(
    chalk.red('- ¿Eliminar un proyecto? (s/n): '),
    (resp) => {
      if (resp.toLowerCase() !== 's') {
        cargarProyectos(tecnologiaSeleccionada);
        return;
      }

      rl.question(
        chalk.yellow('- Número del proyecto a eliminar: '),
        (num) => {
          const indice = parseInt(num) - 1;

          if (
            isNaN(indice) ||
            indice < 0 ||
            indice >= tecnologiaSeleccionada.proyectos.length
          ) {
            mostrarError('numeroInvalido');
            setTimeout(() => cargarProyectos(tecnologiaSeleccionada), 2000);
            return;
          }

          const proyecto = tecnologiaSeleccionada.proyectos[indice];

          try {
            borrarProyecto(proyecto.id, proyecto.ruta);
            log.ok(chalk.green('Proyecto eliminado'));
          } catch (e) {
            log.err(chalk.red('Error al eliminar'), e);
          }

          setTimeout(() => {
            const proyectosActualizados = datosProyectos();
            const tecnologiaActualizada = proyectosActualizados.find(
              t => t.id === tecnologiaSeleccionada.id
            );
            cargarProyectos(tecnologiaActualizada, proyectosActualizados);
          }, 1500);
        }
      );
    }
  );
}

export function crearTecnologia() {
  borrarPantalla();
  
  console.log('='.repeat(50));
  console.log(chalk.blue('- Crear tecnologia'));
  console.log('='.repeat(50));
  rl.question(chalk.yellow('🔧 Nombre de la tecnología: '), (nombre) => {
    const nombreTecnologia = nombre.trim();

    if (!nombreTecnologia) {
      mostrarError('nombreTecnologiaVacio');
      return setTimeout(crearTecnologia, 2000);
    }

    rl.question(chalk.yellow('- Color HEX (#ff0000): '), (color) => {
      const colorHex = color.trim();

      rl.question(chalk.yellow('- Ruta principal: '), (ruta) => {
        const rutaPrincipal = ruta.trim();

        try {
					guardarTecnologia(nombreTecnologia, colorHex, rutaPrincipal);
					log.ok(chalk.green('Tecnología creada correctamente'));
				} catch (error) {
					switch (error.message) {
						case 'COLOR_INVALIDO':
							mostrarError('carpetaInvalida', 'El color no es un HEX válido. Ej: #ff0000');
							break;

						case 'CARPETA_NO_EXISTE':
							mostrarError('carpetaInvalida', 'La carpeta no existe');
							break;

						default:
							log.err(chalk.red('Error inesperado'), error);
					}
				}
        setTimeout(iniciarSistema, 2000);
      });
    });
  });
}

export function crearProyecto(tecnologiaSeleccionada) {
  borrarPantalla();
  if (!tecnologiaSeleccionada) {
    mostrarError('tecnologiaInvalida');
    setTimeout(() => {
      iniciarSistema();
    }, 2000);
    return;
  }
  console.log('='.repeat(50));
  console.log(chalk.blue('- Crear proyecto en:'), tecnologiaSeleccionada.tecnologia);
  console.log('='.repeat(50));
  
  rl.question(chalk.yellow('- Ingresa el nombre del nuevo proyecto: '), (respuesta) => {
    const nombreProyecto = respuesta.trim();

    if (!nombreProyecto) {
      mostrarError('nombreProyectoVacio');
      setTimeout(() => {
        crearProyecto(tecnologiaSeleccionada);
      }, 2000);
      return;
		}

    // const rutaProyecto = tecnologiaSeleccionada.rutaPrincipal + '\\' + nombreProyecto;
		const rutaProyecto = path.join(tecnologiaSeleccionada.rutaPrincipal, nombreProyecto);

    if (existeCarpeta(rutaProyecto)) {
      mostrarError('proyectoExistente', '', nombreProyecto, rutaProyecto);
      setTimeout(() => {
        crearProyecto(tecnologiaSeleccionada);
      }, 2000);
      return;
    }
    
    try {
      crearCarpeta(tecnologiaSeleccionada, nombreProyecto, rutaProyecto);      
      log.ok(chalk.green(`Proyecto creado: ${nombreProyecto}`));
    } catch (error) {
      log.err(chalk.red('Error al guardar el proyecto:'), error);
    }
    setTimeout(() => {
			const proyectosActualizados = datosProyectos();

			const tecnologiaActualizada = proyectosActualizados.find(
				t => t.tecnologia === tecnologiaSeleccionada.tecnologia
			);

			cargarProyectos(tecnologiaActualizada, proyectosActualizados);
		}, 2000);
  });
}

export function preguntarTecnologia(proyectos) {
  rl.question(chalk.yellow('\n- Digite un número valido o "q" para salir: '), (respuesta) => {
    const valor = respuesta.trim().toLowerCase();

    // Salir del modo interactivo
    if (valor === 'q') {
      borrarPantalla();
      log.ok(chalk.green('- Saliendo del modo interactivo...'));
      rl.close();
      return;
    }

		 if (valor === 'c') {
			crearTecnologia();
      return;
    }

    // Entra en las configuraciones
    if (valor === 'e') {
      borrarPantalla();
      const rutaRaiz = obtenerRutaRaiz();
      console.log('Directorio del proyecto:', rutaRaiz);
      log.info(chalk.green('Entrando en configuraciones...'));

      try {
        copiarRutaAlPortapapeles(rutaRaiz);
        log.ok(chalk.green('Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
      } catch (error) {
        log.warn(chalk.yellow('No se pudo copiar al portapapeles ', error));
      }
      rl.close();
      return;
    }

    if (!esNumeroValido(valor, proyectos)) {
      mostrarError('numeroInvalido');
      
      setTimeout(() => {
        iniciarSistema();
      }, 2000);
      return;
    }  

		const indice = parseInt(valor) - 1;
		const tecnologiaSeleccionada = proyectos[indice];

    cargarProyectos(tecnologiaSeleccionada, proyectos);
  });
}

export function preguntarProyecto(tecnologiaSeleccionada, proyectos) {
  rl.question(chalk.yellow('\n- Digite un número valido o escribe "q" para salir: '), (respuesta) => {

    const valorProyecto = respuesta.trim().toLowerCase();
    
    if (valorProyecto === 'q') {
      iniciarSistema();
      return;
    }

		if (valorProyecto === 'd') {
			confirmarEliminarProyecto(tecnologiaSeleccionada);
			return;
		}

    if (valorProyecto === 'c') {
      crearProyecto(tecnologiaSeleccionada, proyectos);
      return;
    }

    if (!esNumeroValido(valorProyecto, tecnologiaSeleccionada.proyectos)) {
      mostrarError('numeroInvalido');
      setTimeout(() => {
        cargarProyectos(tecnologiaSeleccionada, proyectos);
      }, 2000);
      return;
    }
    
		const indice = parseInt(valorProyecto) - 1;
		const proyectoSeleccionado = tecnologiaSeleccionada.proyectos[indice];
    
    borrarPantalla();
    console.log(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}\n`);
    try {
      copiarRutaAlPortapapeles(proyectoSeleccionado.ruta);
      log.ok(chalk.green('Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
    } catch (error) {
      log.warn(chalk.yellow('No se pudo copiar al portapapeles ', error));
    }
    rl.close();
    return;
  });
}

