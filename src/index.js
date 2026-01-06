#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { nombreCli } from './utils/variables.js';
import { systemFilesApp } from './systemFiles/main.js';
import { log } from './utils/logger.js';

program 
	.name('Juan-CLI')
  .description('CLI para gestionar carpetas y archivos hecho por JuanPabloMS')
  .version('JPC-CLI version: 1.0.0', '-v, --version', 'Mostrar versión del CLI')
  .addHelpText('beforeAll', chalk.red(nombreCli));

program
  .command('ruta')
  .description('Mostrar ruta actual')
  .action(() => {
		log.info(`Ruta actual: ${process.cwd()}`);
  });

program
  .command('crear <nombre>')
  .description('Crear carpeta')
  .action((nombre) => {
    const dirPath = path.resolve(nombre);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
			log.ok(`Carpeta creada: ${dirPath}`);
    } else {
			log.warn(`Ya existe: ${dirPath}`);
    }
  });

program
  .command('eliminar <nombre>')
  .description('Eliminar carpeta')
  .action((nombre) => {
    const dirPath = path.resolve(nombre);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      log.ok(`Carpeta eliminada: ${dirPath}`);
    } else {
      log.err(`No existe: ${dirPath}`);
    }
  });

program
  .command('listar [ruta]')
  .description('Listar archivos en una ruta')
  .action((ruta = '.') => {
    const fullPath = path.resolve(ruta);
    if (fs.existsSync(fullPath)) {
      const archivos = fs.readdirSync(fullPath);
      archivos.forEach(a => log.ok('-', a));
    } else {
      log.err('Ruta no existe:', fullPath);
    }
  });

program
  .command('p')
  .description('Modo interactivo de proyectos')
  .action(() => {
    systemFilesApp();
  });

program.parse(process.argv);
