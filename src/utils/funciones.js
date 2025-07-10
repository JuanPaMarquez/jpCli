import chalk from 'chalk';
import clipboardy from 'clipboardy';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { mostrarProyectos, mostrarTecnologias } from '../components/mostrar.js';
import { validarNumero } from './validadores.js';
import { datosProyectos } from '../lib/data.js';

const proyectos = datosProyectos();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function preguntar() {
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
      const projectRoot = obtenerRutaRaiz();
      console.log('Directorio del proyecto:', projectRoot);
      console.log(chalk.green('🔧 Entrando en configuraciones...'));
      copiarRutaAlPortapapeles(projectRoot);
      // Ejemplos de uso:
      // const configFile = obtenerRutaEspecifica('src', 'config', 'settings.json');
      // const packageJsonPath = obtenerRutaEspecifica('package.json');
      
      rl.close();
      return;
    }

    if (!validarNumero(valor, proyectos)) {
      console.log(chalk.red("\nNÚMERO INVALIDO!"));
      setTimeout(() => {
        mostrarTecnologias();
        preguntar();
      }, 1500);
      return;
    }    

    const tecnologiaSeleccionada = proyectos.find(p => p.id === parseInt(valor));
    mostrarProyectos(tecnologiaSeleccionada);
    preguntarProyecto(tecnologiaSeleccionada);
  });
};

export function preguntarProyecto(tecnologiaSeleccionada) {
  rl.question(chalk.yellow('\n🔁 Digite un número valido o escribe "q" para salir: '), (respuesta) => {

    const valorProyecto = respuesta.trim().toLowerCase();
    
    if (valorProyecto === 'q') {
      mostrarTecnologias();
      preguntar();
      return;
    }

    if (!validarNumero(valorProyecto, tecnologiaSeleccionada.proyectos)) {
      console.log(chalk.red("\nNúmero inválido!"));
      setTimeout(() => {
        mostrarProyectos(tecnologiaSeleccionada);
        preguntarProyecto(tecnologiaSeleccionada);
      }, 1500);
      return;
    }
    
    const proyectoSeleccionado = tecnologiaSeleccionada.proyectos.find(p => p.id === parseInt(valorProyecto));
    
    borrarPantalla();
    console.log(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}\n`);
    copiarRutaAlPortapapeles(proyectoSeleccionado.ruta);

    return;
  });
}

function copiarRutaAlPortapapeles(ruta) {
  try {
    const unidad = ruta[0];
    const sinUnidad = ruta.slice(3);
    clipboardy.writeSync(`${unidad}: && cd "${sinUnidad}"`);
    console.log(chalk.green('✅ Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
    rl.close();
  } catch (error) {
    console.log(chalk.yellow('⚠️ No se pudo copiar al portapapeles'));
  }
}

export function borrarPantalla() {
  console.clear();
}

// Función utilitaria para obtener la ruta raíz del proyecto
function obtenerRutaRaiz() {
  const __filename = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(__filename), '../../');
}

// Función para obtener rutas específicas del proyecto
export function obtenerRutaEspecifica(...segments) {
  return path.join(obtenerRutaRaiz(), ...segments);
}