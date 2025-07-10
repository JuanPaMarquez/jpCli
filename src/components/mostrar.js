import chalk from 'chalk';
import { datosProyectos } from '../lib/data.js';

const proyectos = datosProyectos();

export function mostrarTecnologias() {
  console.clear();

  console.log(chalk.blue('📋 Lista de proyectos:'));
  console.log('─'.repeat(50));

  proyectos.forEach(proyecto => {
    console.log(chalk.hex(proyecto.color).bold(`[${proyecto.id}] ${proyecto.tecnologia}`));
  });
};

export function mostrarProyectos(tech) {
  console.clear();

  console.log(chalk.hex(tech.color)(` Proyecto seleccionado: ${tech.tecnologia}\n`));

  tech.proyectos.forEach(p => {
    console.log(`  [${p.id}] ${p.nombre}`);
  });
}
