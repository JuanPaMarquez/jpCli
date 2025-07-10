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
  rl.question(chalk.yellow('\n🔁 Digite un número valido o escribe "q" para salir: '), (respuesta) => {
    const valor = respuesta.trim().toLowerCase();
    if (valor === 'q') {
      console.clear();
      console.log(chalk.green('👋 Saliendo del modo interactivo...'));
      rl.close();
      return;
    }

    if (validarNumero(valor, proyectos)) {
      const tech = proyectos.find(p => p.id === parseInt(valor));
      mostrarProyectos(tech);
      preguntarProyecto(tech);
    } else {
      console.log(chalk.red("\nNúmero inválido!"));
      setTimeout(() => {
        mostrarTecnologias();
        preguntar();
      }, 1500);
    }
  });
};

export function preguntarProyecto(tech) {
  rl.question(chalk.yellow('\n🔁 Digite un número valido o escribe "q" para salir: '), (respuesta) => {
    const valorProyecto = respuesta.trim().toLowerCase();
    
    if (valorProyecto === 'q') {
      console.clear();
      mostrarTecnologias();
      preguntar();
      return;
    }

    if (validarNumero(valorProyecto, tech.proyectos)) {
      const proyectoSeleccionado = tech.proyectos.find(p => p.id === parseInt(valorProyecto));
      console.clear();
      console.log(`Proyecto seleccionado: ${proyectoSeleccionado.nombre}\n`);
      
      try {
        clipboardy.writeSync(`cd "${proyectoSeleccionado.ruta}"`);
        console.clear();
        console.log(chalk.green('✅ Ruta copiada al portapapeles pegala en tu terminal! (Ctrl + V)'));
        rl.close();
      } catch (error) {
        console.log(chalk.yellow('⚠️ No se pudo copiar al portapapeles'));
      }
      return;
    } else {
      console.log(chalk.red("\nNúmero inválido!"));
      setTimeout(() => {
        mostrarProyectos(tech);
        preguntarProyecto(tech);
      }, 1500);
    }
  });
}