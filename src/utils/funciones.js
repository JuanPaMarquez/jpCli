import fs from 'fs';
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

    if (valorProyecto === 'c') {
      crearProyecto(tecnologiaSeleccionada);
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

function crearProyecto(tecnologiaSeleccionada) {
  borrarPantalla();
  if (!tecnologiaSeleccionada) {
    console.log(chalk.red('❌ No se ha seleccionado una tecnología válida.'));
    setTimeout(() => {
      mostrarTecnologias();
      preguntar();
    }, 1500);
    return;
  }
  console.log('='.repeat(50));
  console.log(chalk.blue('📂 Crear proyecto en:'), tecnologiaSeleccionada.tecnologia);
  console.log('='.repeat(50));
  
  rl.question(chalk.yellow('🔧 Ingresa el nombre del nuevo proyecto: '), (respuesta) => {
    const nombreProyecto = respuesta.trim();

    if (!nombreProyecto) {
      console.log(chalk.red('❌ El nombre del proyecto no puede estar vacío.'));
      setTimeout(() => {
        crearProyecto(tecnologiaSeleccionada);
      }, 1500);
      return;
    }

    const rutaProyecto = tecnologiaSeleccionada.rutaPrincipal + '\\' + nombreProyecto;

    if (fs.existsSync(rutaProyecto)) {
      console.log(chalk.red(`❌ El proyecto "${nombreProyecto}" ya existe en la ruta ${rutaProyecto}.`));
      setTimeout(() => {
        crearProyecto(tecnologiaSeleccionada);
      }, 1500);
      return;
    }

    const nuevoProyecto = {
      id: tecnologiaSeleccionada.proyectos.length + 1,
      nombre: nombreProyecto,
      ruta: rutaProyecto
    };
    tecnologiaSeleccionada.proyectos.push(nuevoProyecto);
    try {
      fs.mkdirSync(rutaProyecto, { recursive: true });
      console.log(chalk.blue('📁 Creando carpeta en:'), rutaProyecto);
      fs.writeFileSync(obtenerRutaEspecifica('src', 'lib', 'proyectos.json'), JSON.stringify(proyectos, null, 2));
      console.log(chalk.green(`✅ Proyecto creado: ${nombreProyecto}`));
    } catch (error) {
      console.error(chalk.red('❌ Error al guardar el proyecto:'), error);
    }
    setTimeout(() => {
      mostrarProyectos(tecnologiaSeleccionada);
      preguntarProyecto(tecnologiaSeleccionada);
    }, 2000);
  });
}

function copiarRutaAlPortapapeles(ruta) {
  try {
    const unidad = ruta[0];
    clipboardy.writeSync(`${unidad}: && cd "${ruta}"`);
    console.log(chalk.green('✅ Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
    rl.close();
  } catch (error) {
    console.log(chalk.yellow('⚠️ No se pudo copiar al portapapeles'));
  }
}

export function borrarPantalla() {
  console.clear();
}

function obtenerRutaRaiz() {
  const __filename = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(__filename), '../../');
}

export function obtenerRutaEspecifica(...segments) {
  return path.join(obtenerRutaRaiz(), ...segments);
}