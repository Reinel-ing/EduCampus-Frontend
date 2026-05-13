export class Estudiante {
  constructor({
    id_estudiante,
    nombres,
    apellidos,
    cedula,
    correo,
    telefono,
    estado,
  }) {
    this.id_estudiante = id_estudiante;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.cedula = cedula;
    this.correo = correo;
    this.telefono = telefono;
    this.estado = estado;
  }
}
