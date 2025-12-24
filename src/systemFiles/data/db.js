import Database from 'better-sqlite3';
import { obtenerRutaEspecifica } from '../logic/rutas.js';

const rutaDB = obtenerRutaEspecifica('src', 'systemFiles', 'data', 'proyectos.db');

export const db = new Database(rutaDB);

db.exec(`
	CREATE TABLE IF NOT EXISTS tecnologias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tecnologia TEXT NOT NULL,
    color TEXT NOT NULL,
    ruta_principal TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    ruta TEXT NOT NULL,
    tecnologia_id INTEGER NOT NULL,
    FOREIGN KEY (tecnologia_id) REFERENCES tecnologias(id)
  );
`);


