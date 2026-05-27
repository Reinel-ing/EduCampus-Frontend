/**
 * bugs.test.jsx
 * Tests diseñados para encontrar fallos REALES en los validadores.
 * Si un test falla aqui, hay un bug en el codigo que debe corregirse.
 */
import { renderHook, act } from "@testing-library/react";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";
import { useCursoValidator } from "../hooks/useCursoValidator";
import { useDocenteValidator } from "../hooks/useDocenteValidator";

function runEstudiante(datos, esEdicion = false) {
  const { result } = renderHook(() => useEstudianteValidator());
  let isValid;
  act(() => { isValid = result.current.validate(datos, esEdicion); });
  return { isValid, errors: result.current.errors };
}

function runCurso(datos) {
  const { result } = renderHook(() => useCursoValidator());
  let isValid;
  act(() => { isValid = result.current.validate(datos); });
  return { isValid, errors: result.current.errors };
}

function runDocente(datos, esEdicion = false) {
  const { result } = renderHook(() => useDocenteValidator());
  let isValid;
  act(() => { isValid = result.current.validate(datos, esEdicion); });
  return { isValid, errors: result.current.errors };
}

const estudianteBase = {
  nombres: "Ana Lopez", apellidos: "Garcia Ruiz", cedula: "123456",
  correo: "ana@gmail.com", contraseña: "clave123", telefono: "3001234567", estado: true,
};
const cursoBase = {
  nombre: "Matematicas", cupo_estudiante: 30,
  id_docente: 1, horario: [{ dia: "Lunes", hora: "08:00" }], estado: true,
};
const docenteBase = {
  nombres: "Carlos Perez", apellidos: "Lopez Gil", cedula: "123456",
  correo: "carlos@gmail.com", contraseña: "clave123", especialidad: "Fisica", estado: true,
};

// =============================================================================
// BUG 1: nombres solo con espacios deberia ser invalido
// Fallo esperado: "   " tiene 3 chars pero son solo espacios → debe fallar
// =============================================================================
describe("BUG-01 | nombres con solo espacios", () => {
  test("nombre='   ' (3 espacios) debe ser INVALIDO", () => {
    const { isValid } = runEstudiante({ ...estudianteBase, nombres: "   " });
    expect(isValid).toBe(false); // si pasa → bug: trim no se aplica bien
  });

  test("apellido='   ' (3 espacios) debe ser INVALIDO", () => {
    const { isValid } = runEstudiante({ ...estudianteBase, apellidos: "   " });
    expect(isValid).toBe(false);
  });
});

// =============================================================================
// BUG 2: cupo_estudiante como texto no numerico deberia ser invalido
// Fallo esperado: cupo="abc" pasa la validacion actual → bug real
// =============================================================================
describe("BUG-02 | cupo_estudiante no numerico", () => {
  test("cupo='abc' (texto) debe ser INVALIDO", () => {
    const { isValid } = runCurso({ ...cursoBase, cupo_estudiante: "abc" });
    expect(isValid).toBe(false); // si pasa → bug: no valida que sea numero
  });

  test("cupo=0.5 (fraccion) debe ser INVALIDO", () => {
    const { isValid } = runCurso({ ...cursoBase, cupo_estudiante: 0.5 });
    expect(isValid).toBe(false); // cupo debe ser entero >= 1
  });
});

// =============================================================================
// BUG 3: correo con espacios internos deberia ser invalido
// Fallo esperado: "ana @gmail.com" no deberia pasar el regex
// =============================================================================
describe("BUG-03 | correo con espacios", () => {
  test("correo con espacio antes del @ debe ser INVALIDO", () => {
    const { isValid } = runEstudiante({ ...estudianteBase, correo: "ana @gmail.com" });
    expect(isValid).toBe(false);
  });

  test("correo con espacio despues del @ debe ser INVALIDO", () => {
    const { isValid } = runEstudiante({ ...estudianteBase, correo: "ana@ gmail.com" });
    expect(isValid).toBe(false);
  });
});

// =============================================================================
// BUG 4: cedula con solo espacios deberia ser invalido
// =============================================================================
describe("BUG-04 | cedula con solo espacios", () => {
  test("cedula='      ' (6 espacios) debe ser INVALIDO", () => {
    const { isValid } = runEstudiante({ ...estudianteBase, cedula: "      " });
    expect(isValid).toBe(false); // si pasa → bug: no aplica trim a cedula
  });
});

// =============================================================================
// BUG 5: contraseña con solo espacios deberia ser invalido
// =============================================================================
describe("BUG-05 | contraseña con solo espacios", () => {
  test("contraseña='      ' (6 espacios) debe ser INVALIDO", () => {
    const { isValid } = runEstudiante({ ...estudianteBase, contraseña: "      " });
    expect(isValid).toBe(false); // si pasa → bug: trim no detecta espacios
  });

  test("contraseña docente='      ' debe ser INVALIDO", () => {
    const { isValid } = runDocente({ ...docenteBase, contraseña: "      " });
    expect(isValid).toBe(false);
  });
});

// =============================================================================
// BUG 6: especialidad con solo espacios deberia ser invalido
// =============================================================================
describe("BUG-06 | especialidad con solo espacios", () => {
  test("especialidad='   ' (3 espacios) debe ser INVALIDO", () => {
    const { isValid } = runDocente({ ...docenteBase, especialidad: "   " });
    expect(isValid).toBe(false);
  });
});
