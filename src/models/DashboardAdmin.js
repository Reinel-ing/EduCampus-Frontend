// Modelo para DashboardAdmin
export default class DashboardAdmin {
  constructor({
    total_estudiantes = 0,
    total_docentes = 0,
    total_cursos = 0,
    cursos_activos = 0,
    promedio_rendimiento = 0,
    porcentaje_asistencia = 0,
  } = {}) {
    this.total_estudiantes = total_estudiantes;
    this.total_docentes = total_docentes;
    this.total_cursos = total_cursos;
    this.cursos_activos = cursos_activos;
    this.promedio_rendimiento = promedio_rendimiento;
    this.porcentaje_asistencia = porcentaje_asistencia;
  }
}
