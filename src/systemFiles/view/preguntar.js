import chalk from 'chalk';
import readline from 'readline';
import { esNumeroValido, existeCarpeta } from '../logic/validadores.js';
import { obtenerRutaRaiz, copiarRutaAlPortapapeles } from '../logic/rutas.js';
import { 
  borrarPantalla, 
  mostrarError, 
} from './mostrar.js';
import { cargarProyectos, iniciarSistema } from '../main.js';
import { crearCarpeta } from '../logic/proyectos.js';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function crearProyecto(tecnologiaSeleccionada, proyectos) {
  borrarPantalla();
  if (!tecnologiaSeleccionada) {
    mostrarError('tecnologiaInvalida');
    setTimeout(() => {
      iniciarSistema();
    }, 1500);
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
      }, 1500);
      return;
    }

    const rutaProyecto = tecnologiaSeleccionada.rutaPrincipal + '\\' + nombreProyecto;

    if (existeCarpeta(rutaProyecto)) {
      mostrarError('proyectoExistente', nombreProyecto, rutaProyecto);
      setTimeout(() => {
        crearProyecto(tecnologiaSeleccionada);
      }, 1500);
      return;
    }
    
    try {
      crearCarpeta(tecnologiaSeleccionada, nombreProyecto, rutaProyecto, proyectos);      
      console.log(chalk.green(`✅ Proyecto creado: ${nombreProyecto}`));
    } catch (error) {
      console.error(chalk.red('❌ Error al guardar el proyecto:'), error);
    }
    setTimeout(() => {
      cargarProyectos(tecnologiaSeleccionada, proyectos);
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
      }, 1500);
      return;
    }  

    const tecnologiaSeleccionada = proyectos.find(p => p.id === parseInt(valor));
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

    if (valorProyecto === 'c') {
      crearProyecto(tecnologiaSeleccionada, proyectos);
      return;
    }

    if (!esNumeroValido(valorProyecto, tecnologiaSeleccionada.proyectos)) {
      mostrarError('numeroInvalido');
      setTimeout(() => {
        cargarProyectos(tecnologiaSeleccionada, proyectos);
      }, 1500);
      return;
    }
    
    const proyectoSeleccionado = tecnologiaSeleccionada.proyectos.find(p => p.id === parseInt(valorProyecto));
    
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

