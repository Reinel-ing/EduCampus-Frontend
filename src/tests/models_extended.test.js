import DashboardAdmin from "../models/DashboardAdmin";
import { Configuracion } from "../models/Configuracion";

describe("DashboardAdmin — pruebas unitarias", () => {
  test("UT-DA01 | constructor crea instancia con valores por defecto", () => {
    const d = new DashboardAdmin();
    expect(d.total_estudiantes).toBe(0);
    expect(d.total_docentes).toBe(0);
    expect(d.total_cursos).toBe(0);
    expect(d.cursos_activos).toBe(0);
    expect(d.promedio_rendimiento).toBe(0);
    expect(d.porcentaje_asistencia).toBe(0);
  });

  test("UT-DA02 | constructor asigna valores proporcionados", () => {
    const d = new DashboardAdmin({ total_estudiantes: 50, total_docentes: 10, total_cursos: 8, cursos_activos: 6, promedio_rendimiento: 3.8, porcentaje_asistencia: 85 });
    expect(d.total_estudiantes).toBe(50);
    expect(d.total_docentes).toBe(10);
    expect(d.cursos_activos).toBe(6);
    expect(d.promedio_rendimiento).toBe(3.8);
  });

  test("UT-DA03 | instancia es de tipo DashboardAdmin", () => {
    expect(new DashboardAdmin()).toBeInstanceOf(DashboardAdmin);
  });

  test("UT-DA04 | acepta porcentaje_asistencia como número", () => {
    const d = new DashboardAdmin({ porcentaje_asistencia: 92.5 });
    expect(d.porcentaje_asistencia).toBe(92.5);
  });

  test("UT-DA05 | valores parciales usan defecto 0 para los faltantes", () => {
    const d = new DashboardAdmin({ total_estudiantes: 20 });
    expect(d.total_estudiantes).toBe(20);
    expect(d.total_docentes).toBe(0);
  });

  test("UT-DA06 | dos instancias son independientes", () => {
    const d1 = new DashboardAdmin({ total_estudiantes: 10 });
    const d2 = new DashboardAdmin({ total_estudiantes: 20 });
    expect(d1.total_estudiantes).toBe(10);
    expect(d2.total_estudiantes).toBe(20);
  });
});

describe("Configuracion — pruebas unitarias", () => {
  test("UT-CO01 | constructor crea instancia con valores por defecto", () => {
    const c = new Configuracion();
    expect(c.id).toBeNull();
    expect(c.nombre_institucion).toBe("");
    expect(c.email_contacto).toBe("");
    expect(c.ano_academico).toBe("");
  });

  test("UT-CO02 | constructor asigna valores proporcionados", () => {
    const c = new Configuracion({ id: 1, nombre_institucion: "EduCampus", email_contacto: "admin@edu.co", ano_academico: "2025-2026" });
    expect(c.id).toBe(1);
    expect(c.nombre_institucion).toBe("EduCampus");
    expect(c.email_contacto).toBe("admin@edu.co");
  });

  test("UT-CO03 | esValido retorna true con todos los campos", () => {
    const c = new Configuracion({ nombre_institucion: "EduCampus", email_contacto: "admin@edu.co", ano_academico: "2025-2026" });
    expect(c.esValido()).toBe(true);
  });

  test("UT-CO04 | esValido retorna false con nombre vacío", () => {
    const c = new Configuracion({ nombre_institucion: "", email_contacto: "admin@edu.co", ano_academico: "2025-2026" });
    expect(c.esValido()).toBe(false);
  });

  test("UT-CO05 | tieneEmailValido retorna true con email correcto", () => {
    const c = new Configuracion({ email_contacto: "test@gmail.com" });
    expect(c.tieneEmailValido()).toBe(true);
  });

  test("UT-CO06 | tieneEmailValido retorna false con email inválido", () => {
    const c = new Configuracion({ email_contacto: "no-es-email" });
    expect(c.tieneEmailValido()).toBe(false);
  });

  test("UT-CO07 | instancia es de tipo Configuracion", () => {
    expect(new Configuracion()).toBeInstanceOf(Configuracion);
  });
});
