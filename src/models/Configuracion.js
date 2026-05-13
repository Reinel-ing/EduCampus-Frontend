export class Configuracion {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre_institucion = data.nombre_institucion || "";
    this.email_contacto = data.email_contacto || "";
    this.ano_academico = data.ano_academico || "";
  }

  // Validaciones
  esValido() {
    return (
      this.nombre_institucion.trim() !== "" &&
      this.email_contacto.trim() !== "" &&
      this.ano_academico.trim() !== ""
    );
  }

  // Validar email
  tieneEmailValido() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email_contacto);
  }
}
