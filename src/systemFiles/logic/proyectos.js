import { db } from '../data/db.js';
import fs from 'fs';

export function crearCarpeta(tecnologiaSeleccionada, nombreProyecto, rutaProyecto) {
	fs.mkdirSync(rutaProyecto, { recursive: true });

	const stmt = db.prepare(`
		INSERT INTO proyectos (nombre, ruta, tecnologia_id)
		VALUES (?, ?, ?)
	`);

	stmt.run(nombreProyecto, rutaProyecto, tecnologiaSeleccionada.id);
}


export function borrarProyecto(proyectoId, rutaProyecto) {
  if (fs.existsSync(rutaProyecto)) {
    fs.rmSync(rutaProyecto, { recursive: true, force: true });
  }

  const stmt = db.prepare(`
    DELETE FROM proyectos
    WHERE id = ?
  `);

  stmt.run(proyectoId);
}
