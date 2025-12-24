import chalk from 'chalk';
import readline from 'readline';
import { esNumeroValido, existeCarpeta } from '../logic/validadores.js';
import { obtenerRutaRaiz, copiarRutaAlPortapapeles } from '../logic/rutas.js';
import { 
  borrarPantalla, 
  mostrarError, 
} from './mostrar.js';
import { cargarProyectos, iniciarSistema } from '../main.js';
import { borrarProyecto, crearCarpeta } from '../logic/proyectos.js';
import path from 'path';
import { datosProyectos } from '../data/data.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function confirmarEliminarProyecto(tecnologiaSeleccionada) {
  rl.question(
    chalk.red('⚠️ ¿Eliminar un proyecto? (s/n): '),
    (resp) => {
      if (resp.toLowerCase() !== 's') {
        cargarProyectos(tecnologiaSeleccionada);
        return;
      }

      rl.question(
        chalk.yellow('👉 Número del proyecto a eliminar: '),
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
            console.log(chalk.green('✅ Proyecto eliminado'));
          } catch (e) {
            console.error(chalk.red('❌ Error al eliminar'), e);
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
  console.log(chalk.blue('📂 Crear proyecto en:'), tecnologiaSeleccionada.tecnologia);
  console.log('='.repeat(50));
  
  rl.question(chalk.yellow('🔧 Ingresa el nombre del nuevo proyecto: '), (respuesta) => {
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
      console.log(chalk.green(`✅ Proyecto creado: ${nombreProyecto}`));
    } catch (error) {
      console.error(chalk.red('❌ Error al guardar el proyecto:'), error);
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
  rl.question(chalk.yellow('\n🔁 Digite un número valido o "q" para salir: '), (respuesta) => {
    const valor = respuesta.trim().toLowerCase();

    // Salir del modo interactivo
    if (valor === 'q') {
      borrarPantalla();
      console.log(chalk.green('👋 Saliendo del modo interactivo...'));
      rl.close();
      return;
    }

    // Entra en las configuraciones
    if (valor === 'e') {
      borrarPantalla();
      const rutaRaiz = obtenerRutaRaiz();
      console.log('Directorio del proyecto:', rutaRaiz);
      console.log(chalk.green('🔧 Entrando en configuraciones...'));

      try {
        copiarRutaAlPortapapeles(rutaRaiz);
        console.log(chalk.green('✅ Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
      } catch (error) {
        console.log(chalk.yellow('⚠️ No se pudo copiar al portapapeles ', error));
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
  rl.question(chalk.yellow('\n🔁 Digite un número valido o escribe "q" para salir: '), (respuesta) => {

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
      console.log(chalk.green('✅ Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
    } catch (error) {
      console.log(chalk.yellow('⚠️ No se pudo copiar al portapapeles ', error));
    }
    rl.close();
    return;
  });
}

