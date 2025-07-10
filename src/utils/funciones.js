import chalk from 'chalk';
import clipboardy from 'clipboardy';
import readline from 'readline';
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

    if (valor === 'q') {
      borrarPantalla();
      console.log(chalk.green('👋 Saliendo del modo interactivo...'));
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
    
    borrarPantalla();
    const proyectoSeleccionado = tecnologiaSeleccionada.proyectos.find(p => p.id === parseInt(valorProyecto));
    console.log(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}\n`);
    
    try {
      clipboardy.writeSync(`cd "${proyectoSeleccionado.ruta}"`);
      borrarPantalla();
      console.log(chalk.green('✅ Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
      rl.close();
    } catch (error) {
      console.log(chalk.yellow('⚠️ No se pudo copiar al portapapeles'));
    }

    return;
  });
}


export function borrarPantalla() {
  console.clear();
}