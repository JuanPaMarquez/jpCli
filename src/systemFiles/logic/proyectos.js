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
