#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline';
import { nombreCli } from './utils/variables.js';
import { proyectos } from './lib/proyectos.js';

program
  .name('Juan-CLI')
  .description('CLI para gestionar carpetas y archivos hecho por JuanPabloMS')
  .version('version: 1.0.0', '-v, --version', 'Mostrar versión del CLI')
  .addHelpText('beforeAll', chalk.red(nombreCli));

program
  .command('saludar')
  .option('-n, --nombre [nombre]', 'Nombre del usuario', 'JuanPabloMS')
  .action((options) => {
    console.log(`👋 Hola, soy ${options.nombre}, ¡bienvenido a mi CLI!`);
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
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const mostrarTecnologias = () => {
      console.clear();
      if (!proyectos) {
        console.log('❌ No se encontraron proyectos en la carpeta lib.');
        rl.close();
        return;
      }

      console.log(chalk.blue('📋 Lista de proyectos:'));
      console.log('─'.repeat(50));

      proyectos.forEach(proyecto => {
        console.log(chalk.hex(proyecto.color).bold(`\n[${proyecto.id}] ${proyecto.tecnologia}`));
        proyecto.proyectos.forEach(p => {
          console.log(`  📄 ${p.nombre}: ${chalk.gray(p.ruta)}`);
        });
      });
    };

    const preguntar = () => {
      rl.question(chalk.yellow('\n🔁 Digite un número valido o escribe "q" para salir: '), (respuesta) => {
        if (respuesta.trim().toLowerCase() === 'q') {
          console.clear();
          console.log(chalk.green('👋 Saliendo del modo interactivo...'));
          rl.close();
        } else {
          console.log(chalk.red("\nNumero invalido!"));
          setTimeout(() => {
            console.clear();
            mostrarTecnologias();
            preguntar();
          }, 2000);
        }
      });
    };

    mostrarTecnologias();
    preguntar();
  });

program.parse(process.argv);
