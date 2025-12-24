import { db } from './db.js';

export function datosProyectos() {
	const tecnologias = db.prepare(`
		SELECT * FROM tecnologias
	`).all();

	return tecnologias.map(tech => {
		const proyectos = db.prepare(`
			SELECT id, nombre, ruta
			FROM proyectos
			WHERE tecnologia_id = ?
		`).all(tech.id);

		return {
			id: tech.id,
			tecnologia: tech.tecnologia,
			color: tech.color,
			rutaPrincipal: tech.ruta_principal,
			proyectos
		};
	});
}
