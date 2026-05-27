import { renderHook, act } from "@testing-library/react";
import { useDocenteValidator } from "../hooks/useDocenteValidator";

const docenteValido = {
  nombres:      "Carlos Perez",
  apellidos:    "Rodriguez Lima",
  cedula:       "123456",
  correo:       "carlos@gmail.com",
  contraseña:   "clave123",
  especialidad: "Matematicas",
  estado:       true,
};

function runValidate(datos, esEdicion = false) {
  const { result } = renderHook(() => useDocenteValidator());
  let isValid;
  act(() => { isValid = result.current.validate(datos, esEdicion); });
  return { isValid, errors: result.current.errors };
}

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: nombres
// =============================================================================
describe("CE — campo nombres", () => {
  test("CE-01 | valido: nombre con 3 o mas caracteres", () => {
    const { isValid } = runValidate(docenteValido);
    expect(isValid).toBe(true);
  });

  test("CE-02 | invalido: nombre con menos de 3 caracteres", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, nombres: "Ca" });
    expect(isValid).toBe(false);
    expect(errors.nombres).toBeDefined();
  });

  test("CE-03 | invalido: nombre vacio", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, nombres: "" });
    expect(isValid).toBe(false);
    expect(errors.nombres).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: especialidad
// =============================================================================
describe("CE — campo especialidad", () => {
  test("CE-04 | valido: especialidad con 3 o mas caracteres", () => {
    const { isValid } = runValidate({ ...docenteValido, especialidad: "Arte" });
    expect(isValid).toBe(true);
  });

  test("CE-05 | invalido: especialidad con menos de 3 caracteres", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, especialidad: "TI" });
    expect(isValid).toBe(false);
    expect(errors.especialidad).toBeDefined();
  });

  test("CE-06 | invalido: especialidad vacia", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, especialidad: "" });
    expect(isValid).toBe(false);
    expect(errors.especialidad).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: correo
// =============================================================================
describe("CE — campo correo", () => {
  test("CE-07 | valido: correo con formato correcto", () => {
    const { isValid } = runValidate({ ...docenteValido, correo: "docente@outlook.com" });
    expect(isValid).toBe(true);
  });

  test("CE-08 | invalido: correo sin dominio", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, correo: "docente@" });
    expect(isValid).toBe(false);
    expect(errors.correo).toBeDefined();
  });

  test("CE-09 | invalido: correo vacio", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, correo: "" });
    expect(isValid).toBe(false);
    expect(errors.correo).toBeDefined();
  });
});

// =============================================================================
// VALORES LIMITE — especialidad (limite: 3 caracteres)
// =============================================================================
describe("VL — campo especialidad (limite 3 chars)", () => {
  test("VL-01 | 2 caracteres → invalido", () => {
    const { isValid } = runValidate({ ...docenteValido, especialidad: "TI" });
    expect(isValid).toBe(false);
  });

  test("VL-02 | exactamente 3 caracteres → valido", () => {
    const { isValid } = runValidate({ ...docenteValido, especialidad: "Bio" });
    expect(isValid).toBe(true);
  });

  test("VL-03 | 4 caracteres → valido", () => {
    const { isValid } = runValidate({ ...docenteValido, especialidad: "Arte" });
    expect(isValid).toBe(true);
  });
});

// =============================================================================
// VALORES LIMITE — cedula (limite: 6 caracteres)
// =============================================================================
describe("VL — campo cedula (limite 6 chars)", () => {
  test("VL-04 | 5 caracteres → invalido", () => {
    const { isValid } = runValidate({ ...docenteValido, cedula: "12345" });
    expect(isValid).toBe(false);
  });

  test("VL-05 | exactamente 6 caracteres → valido", () => {
    const { isValid } = runValidate({ ...docenteValido, cedula: "123456" });
    expect(isValid).toBe(true);
  });

  test("VL-06 | 10 caracteres → valido", () => {
    const { isValid } = runValidate({ ...docenteValido, cedula: "1234567890" });
    expect(isValid).toBe(true);
  });
});

// =============================================================================
// CAMINO BASICO — flujo del metodo validate()
// =============================================================================
describe("CB — camino basico del validate()", () => {
  test("CB-01 | camino feliz: todos los campos validos → retorna true", () => {
    const { isValid, errors } = runValidate(docenteValido);
    expect(isValid).toBe(true);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test("CB-02 | todos los campos invalidos → multiples errores", () => {
    const { isValid, errors } = runValidate({ nombres: "", apellidos: "", cedula: "", correo: "", contraseña: "", especialidad: "", estado: null });
    expect(isValid).toBe(false);
    expect(Object.keys(errors).length).toBeGreaterThan(3);
  });

  test("CB-03 | modo edicion sin contraseña → no valida contraseña", () => {
    const { isValid } = runValidate({ ...docenteValido, contraseña: "" }, true);
    expect(isValid).toBe(true);
  });

  test("CB-04 | estado no booleano → genera error de estado", () => {
    const { isValid, errors } = runValidate({ ...docenteValido, estado: "activo" });
    expect(isValid).toBe(false);
    expect(errors.estado).toBeDefined();
  });
});
