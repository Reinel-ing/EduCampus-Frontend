export class Curso {
  constructor({
    id_curso,
    nombre,
    cupo_estudiante,
    horario,
    id_docente,
    estado,
  }) {
    this.id_curso = id_curso;
    this.nombre = nombre;
    this.cupo_estudiante = cupo_estudiante;
    this.horario = horario; // JSONB en el backend
    this.id_docente = id_docente;
    this.estado = estado;
  }
}
