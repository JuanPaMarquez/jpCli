import fs from 'fs';
import Database from 'better-sqlite3';
import { obtenerRutaEspecifica } from '../logic/rutas.js';

// Ruta al JSON original
const rutaJSON = obtenerRutaEspecifica(
  'src',
  'systemFiles',
  'data',
  'rutas_linux.json'
);

// Ruta a la base de datos
const rutaDB = obtenerRutaEspecifica(
  'src',
  'systemFiles',
  'data',
  'proyectos.db'
);

// Abrir DB
const db = new Database(rutaDB);

// Crear tablas
db.exec(`
  DROP TABLE IF EXISTS proyectos;
  DROP TABLE IF EXISTS tecnologias;

  CREATE TABLE tecnologias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tecnologia TEXT NOT NULL,
    color TEXT NOT NULL,
    ruta_principal TEXT NOT NULL
  );

  CREATE TABLE proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    ruta TEXT NOT NULL,
    tecnologia_id INTEGER NOT NULL,
    FOREIGN KEY (tecnologia_id) REFERENCES tecnologias(id)
  );
`);

console.log('📦 Tablas creadas');

// Leer JSON
const data = JSON.parse(fs.readFileSync(rutaJSON, 'utf8'));

// Preparar statements
const insertTecnologia = db.prepare(`
  INSERT INTO tecnologias (tecnologia, color, ruta_principal)
  VALUES (?, ?, ?)
`);

const insertProyecto = db.prepare(`
  INSERT INTO proyectos (nombre, ruta, tecnologia_id)
  VALUES (?, ?, ?)
`);

// Transacción
const migrar = db.transaction(() => {
  for (const tech of data) {
    const result = insertTecnologia.run(
      tech.tecnologia,
      tech.color,
      tech.rutaPrincipal
    );

    const tecnologiaId = result.lastInsertRowid;

    for (const proyecto of tech.proyectos) {
      insertProyecto.run(
        proyecto.nombre,
        proyecto.ruta,
        tecnologiaId
      );
    }
  }
});

migrar();

console.log('✅ Migración completada correctamente');
console.log(`📊 Tecnologías migradas: ${data.length}`);

db.close();

