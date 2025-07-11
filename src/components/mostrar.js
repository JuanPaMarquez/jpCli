import chalk from 'chalk';
import { datosProyectos } from '../lib/data.js';
import { borrarPantalla } from '../utils/funciones.js';

const proyectos = datosProyectos();

export function mostrarTecnologias() {
  borrarPantalla();
  console.log('='.repeat(50));
  console.log(chalk.blue('📋 Lista de proyectos:'));
  console.log('='.repeat(50));

  proyectos.forEach(proyecto => {
    console.log(chalk.hex(proyecto.color).bold(`[${proyecto.id}] ${proyecto.tecnologia}`));
  });

  mostrarConfiguraciones();
};

export function mostrarProyectos(tech) {
  borrarPantalla();
  console.log('='.repeat(50));
  console.log(chalk.hex(tech.color)(` Tecnologia: ${tech.tecnologia.toUpperCase()}`));
  console.log('='.repeat(50));

  tech.proyectos.forEach(p => {
    console.log(`  [${p.id}] ${p.nombre}`);
  });
  console.log('='.repeat(50));
  console.log(chalk.green('[c] Crear proyecto'));
  console.log(chalk.red('[q] Salir'));
}

export function mostrarConfiguraciones() {
  console.log('='.repeat(50));
  console.log(chalk.green('[e] Configuraciones:'));
  console.log(chalk.red('[q] Salir'));
}