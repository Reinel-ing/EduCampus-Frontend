import { Estudiante } from "../models/Estudiante";
import { Docente } from "../models/Docente";
import { Curso } from "../models/Curso";

describe("Modelo Estudiante — pruebas unitarias", () => {
  const datosEstudiante = {
    id_estudiante: 1,
    nombres: "Juan",
    apellidos: "Garcia",
    cedula: "1234567",
    correo: "juan@gmail.com",
    telefono: "3001234567",
    estado: true,
  };

  test("UT-ME01 | constructor crea instancia con todos los campos", () => {
    const e = new Estudiante(datosEstudiante);
    expect(e.id_estudiante).toBe(1);
    expect(e.nombres).toBe("Juan");
    expect(e.apellidos).toBe("Garcia");
    expect(e.cedula).toBe("1234567");
    expect(e.correo).toBe("juan@gmail.com");
    expect(e.telefono).toBe("3001234567");
    expect(e.estado).toBe(true);
  });

  test("UT-ME02 | instancia es de tipo Estudiante", () => {
    const e = new Estudiante(datosEstudiante);
    expect(e).toBeInstanceOf(Estudiante);
  });

  test("UT-ME03 | estado false se asigna correctamente", () => {
    const e = new Estudiante({ ...datosEstudiante, estado: false });
    expect(e.estado).toBe(false);
  });

  test("UT-ME04 | id_estudiante undefined no lanza error", () => {
    expect(() => new Estudiante({ ...datosEstudiante, id_estudiante: undefined })).not.toThrow();
  });

  test("UT-ME05 | dos instancias con mismos datos son independientes", () => {
    const e1 = new Estudiante(datosEstudiante);
    const e2 = new Estudiante(datosEstudiante);
    e1.nombres = "Carlos";
    expect(e2.nombres).toBe("Juan");
  });
});

describe("Modelo Docente — pruebas unitarias", () => {
  const datosDocente = {
    id_docente: 2,
    nombres: "Maria",
    apellidos: "Lopez",
    cedula: "9876543",
    correo: "maria@gmail.com",
    especialidad: "Matematicas",
    telefono: "3109876543",
    estado: true,
  };

  test("UT-MD01 | constructor crea instancia con todos los campos", () => {
    const d = new Docente(datosDocente);
    expect(d.id_docente).toBe(2);
    expect(d.nombres).toBe("Maria");
    expect(d.especialidad).toBe("Matematicas");
    expect(d.estado).toBe(true);
  });

  test("UT-MD02 | instancia es de tipo Docente", () => {
    const d = new Docente(datosDocente);
    expect(d).toBeInstanceOf(Docente);
  });

  test("UT-MD03 | telefono null se asigna como null", () => {
    const d = new Docente({ ...datosDocente, telefono: undefined });
    expect(d.telefono).toBeNull();
  });

  test("UT-MD04 | estado false se asigna correctamente", () => {
    const d = new Docente({ ...datosDocente, estado: false });
    expect(d.estado).toBe(false);
  });

  test("UT-MD05 | correo se asigna correctamente", () => {
    const d = new Docente(datosDocente);
    expect(d.correo).toBe("maria@gmail.com");
  });
});

describe("Modelo Curso — pruebas unitarias", () => {
  const datosCurso = {
    id_curso: 3,
    nombre: "Calculo Integral",
    cupo_estudiante: 30,
    horario: [{ dia: "Lunes", hora: "08:00" }],
    id_docente: 2,
    estado: true,
  };

  test("UT-MC01 | constructor crea instancia con todos los campos", () => {
    const c = new Curso(datosCurso);
    expect(c.id_curso).toBe(3);
    expect(c.nombre).toBe("Calculo Integral");
    expect(c.cupo_estudiante).toBe(30);
    expect(c.id_docente).toBe(2);
    expect(c.estado).toBe(true);
  });

  test("UT-MC02 | instancia es de tipo Curso", () => {
    const c = new Curso(datosCurso);
    expect(c).toBeInstanceOf(Curso);
  });

  test("UT-MC03 | horario se asigna como array", () => {
    const c = new Curso(datosCurso);
    expect(Array.isArray(c.horario)).toBe(true);
    expect(c.horario.length).toBe(1);
  });

  test("UT-MC04 | múltiples horarios se asignan correctamente", () => {
    const c = new Curso({
      ...datosCurso,
      horario: [
        { dia: "Lunes", hora: "08:00" },
        { dia: "Miercoles", hora: "10:00" },
      ],
    });
    expect(c.horario.length).toBe(2);
  });

  test("UT-MC05 | estado false se asigna correctamente", () => {
    const c = new Curso({ ...datosCurso, estado: false });
    expect(c.estado).toBe(false);
  });

  test("UT-MC06 | cupo_estudiante se asigna correctamente", () => {
    const c = new Curso({ ...datosCurso, cupo_estudiante: 50 });
    expect(c.cupo_estudiante).toBe(50);
  });

  test("UT-MC07 | nombre se asigna correctamente", () => {
    const c = new Curso(datosCurso);
    expect(c.nombre).toBe("Calculo Integral");
  });

  test("UT-MC08 | dos instancias son independientes", () => {
    const c1 = new Curso(datosCurso);
    const c2 = new Curso(datosCurso);
    c1.nombre = "Otro Curso";
    expect(c2.nombre).toBe("Calculo Integral");
  });
});
