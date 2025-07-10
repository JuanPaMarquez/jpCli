#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline';
import { preguntar } from './utils/funciones.js';
import { mostrarTecnologias } from './components/mostrar.js';
import { nombreCli } from './utils/variables.js';

program
  .name('Juan-CLI')
  .description('CLI para gestionar carpetas y archivos hecho por JuanPabloMS')
  .version('version: 1.0.0', '-v, --version', 'Mostrar versión del CLI')
  .addHelpText('beforeAll', chalk.red(nombreCli));

program
  .command('agregar <nombre>')
  .action((nombre) => {
    proyectos.push({
      id: proyectos.length + 1,
      tecnologia: nombre,
      color: '#'+Math.floor(Math.random()*16777215).toString(16), // Genera un color aleatorio
      proyectos: []
    });
    fs.writeFileSync(proyectosPath, JSON.stringify(proyectos, null, 2));
  });

program
  .command('ruta')
  .description('Mostrar ruta actual')
  .action(() => {
    console.log(`📂 Ruta actual: ${process.cwd()}`);
  });

program
  .command('crear <nombre>')
  .description('Crear carpeta')
  .action((nombre) => {
    const dirPath = path.resolve(nombre);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Carpeta creada: ${dirPath}`);
    } else {
      console.log(`⚠️ Ya existe: ${dirPath}`);
    }
  });

program
  .command('eliminar <nombre>')
  .description('Eliminar carpeta')
  .action((nombre) => {
    const dirPath = path.resolve(nombre);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`🗑️ Carpeta eliminada: ${dirPath}`);
    } else {
      console.log(`❌ No existe: ${dirPath}`);
    }
  });

program
  .command('listar [ruta]')
  .description('Listar archivos en una ruta')
  .action((ruta = '.') => {
    const fullPath = path.resolve(ruta);
    if (fs.existsSync(fullPath)) {
      const archivos = fs.readdirSync(fullPath);
      archivos.forEach(a => console.log('📄', a));
    } else {
      console.log('❌ Ruta no existe:', fullPath);
    }
  });

program
  .command('proyectos')
  .description('Modo interactivo de proyectos')
  .action(() => {
    mostrarTecnologias();
    preguntar();
  });

program.parse(process.argv);
