import { mostrarError, mostrarTecnologias, mostrarProyectos } from './view/mostrar.js';
import { preguntarTecnologia, preguntarProyecto } from './view/preguntar.js';
import { datosProyectos } from './data/data.js';
import { hayProyectos } from './logic/validadores.js';

export function cargarProyectos(tecnologiaSeleccionada, proyectos) {
  mostrarProyectos(tecnologiaSeleccionada);
  preguntarProyecto(tecnologiaSeleccionada, proyectos);
}

export function iniciarSistema() {
  const proyectos = datosProyectos();

  if (!hayProyectos(proyectos)) {
    mostrarError('proyectosVacios');
    return;
  }

  mostrarTecnologias(proyectos);
  preguntarTecnologia(proyectos);
}

export function systemFilesApp() {
  console.log('Iniciando el sistema de archivos...');
  iniciarSistema();
}