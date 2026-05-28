export class Docente {
  constructor({
    nombres,
    apellidos,
    cedula,
    correo,
    especialidad,
    telefono,
    estado,
    id_docente,
  }) {
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.cedula = cedula;
    this.correo = correo;
    this.especialidad = especialidad;
    this.telefono = telefono || null;
    this.estado = estado;
    this.id_docente = id_docente;
  }
}
