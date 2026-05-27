import { renderHook, act } from "@testing-library/react";
import { useCursoValidator } from "../hooks/useCursoValidator";

const cursoValido = {
  nombre:          "Matematicas I",
  cupo_estudiante: 30,
  id_docente:      1,
  horario:         [{ dia: "Lunes", hora: "08:00-10:00" }],
  estado:          true,
};

function runValidate(datos) {
  const { result } = renderHook(() => useCursoValidator());
  let isValid;
  act(() => { isValid = result.current.validate(datos); });
  return { isValid, errors: result.current.errors };
}

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: nombre
// =============================================================================
describe("CE — campo nombre", () => {
  test("CE-01 | valido: nombre con 3 o mas caracteres", () => {
    const { isValid } = runValidate(cursoValido);
    expect(isValid).toBe(true);
  });

  test("CE-02 | invalido: nombre con menos de 3 caracteres", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, nombre: "Ma" });
    expect(isValid).toBe(false);
    expect(errors.nombre).toBeDefined();
  });

  test("CE-03 | invalido: nombre vacio", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, nombre: "" });
    expect(isValid).toBe(false);
    expect(errors.nombre).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: cupo_estudiante
// =============================================================================
describe("CE — campo cupo_estudiante", () => {
  test("CE-04 | valido: cupo mayor a 0", () => {
    const { isValid } = runValidate({ ...cursoValido, cupo_estudiante: 25 });
    expect(isValid).toBe(true);
  });

  test("CE-05 | invalido: cupo igual a 0", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, cupo_estudiante: 0 });
    expect(isValid).toBe(false);
    expect(errors.cupo_estudiante).toBeDefined();
  });

  test("CE-06 | invalido: cupo negativo", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, cupo_estudiante: -5 });
    expect(isValid).toBe(false);
    expect(errors.cupo_estudiante).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: horario
// =============================================================================
describe("CE — campo horario", () => {
  test("CE-07 | valido: horario con al menos un elemento", () => {
    const { isValid } = runValidate({ ...cursoValido, horario: [{ dia: "Lunes", hora: "08:00" }] });
    expect(isValid).toBe(true);
  });

  test("CE-08 | invalido: horario array vacio", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, horario: [] });
    expect(isValid).toBe(false);
    expect(errors.horario).toBeDefined();
  });

  test("CE-09 | invalido: horario nulo", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, horario: null });
    expect(isValid).toBe(false);
    expect(errors.horario).toBeDefined();
  });

  test("CE-10 | invalido: horario no es array", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, horario: "Lunes 8am" });
    expect(isValid).toBe(false);
    expect(errors.horario).toBeDefined();
  });
});

// =============================================================================
// VALORES LIMITE — cupo_estudiante (limite: 1)
// =============================================================================
describe("VL — campo cupo_estudiante (limite 1)", () => {
  test("VL-01 | cupo 0 → invalido", () => {
    const { isValid } = runValidate({ ...cursoValido, cupo_estudiante: 0 });
    expect(isValid).toBe(false);
  });

  test("VL-02 | cupo exactamente 1 → valido", () => {
    const { isValid } = runValidate({ ...cursoValido, cupo_estudiante: 1 });
    expect(isValid).toBe(true);
  });

  test("VL-03 | cupo 2 → valido", () => {
    const { isValid } = runValidate({ ...cursoValido, cupo_estudiante: 2 });
    expect(isValid).toBe(true);
  });
});

// =============================================================================
// CAMINO BASICO — flujo del metodo validate()
// =============================================================================
describe("CB — camino basico del validate()", () => {
  test("CB-01 | camino feliz: todos los campos validos → retorna true", () => {
    const { isValid, errors } = runValidate(cursoValido);
    expect(isValid).toBe(true);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test("CB-02 | sin docente asignado → error en id_docente", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, id_docente: null });
    expect(isValid).toBe(false);
    expect(errors.id_docente).toBeDefined();
  });

  test("CB-03 | estado no booleano → error en estado", () => {
    const { isValid, errors } = runValidate({ ...cursoValido, estado: "activo" });
    expect(isValid).toBe(false);
    expect(errors.estado).toBeDefined();
  });

  test("CB-04 | varios campos invalidos simultaneamente → multiples errores", () => {
    const { isValid, errors } = runValidate({ nombre: "", cupo_estudiante: 0, id_docente: null, horario: [], estado: null });
    expect(isValid).toBe(false);
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(4);
  });
});
