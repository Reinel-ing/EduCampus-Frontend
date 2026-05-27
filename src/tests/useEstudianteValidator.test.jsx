import { renderHook, act } from "@testing-library/react";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";

// ─── datos base validos ───────────────────────────────────────────────────────
const estudianteValido = {
  nombres:    "Ana Martinez",
  apellidos:  "Lopez Garcia",
  cedula:     "123456",
  correo:     "ana@gmail.com",
  contraseña: "clave123",
  telefono:   "3001234567",
  estado:     true,
};

// ─── helper ───────────────────────────────────────────────────────────────────
function runValidate(datos, esEdicion = false) {
  const { result } = renderHook(() => useEstudianteValidator());
  let isValid;
  act(() => { isValid = result.current.validate(datos, esEdicion); });
  return { isValid, errors: result.current.errors };
}

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: nombres
// =============================================================================
describe("CE — campo nombres", () => {
  test("CE-01 | valido: nombre con 3 o mas caracteres", () => {
    const { isValid } = runValidate(estudianteValido);
    expect(isValid).toBe(true);
  });

  test("CE-02 | invalido: nombre con menos de 3 caracteres", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, nombres: "An" });
    expect(isValid).toBe(false);
    expect(errors.nombres).toBeDefined();
  });

  test("CE-03 | invalido: nombre vacio", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, nombres: "" });
    expect(isValid).toBe(false);
    expect(errors.nombres).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: cedula
// =============================================================================
describe("CE — campo cedula", () => {
  test("CE-04 | valido: cedula con 6 o mas caracteres", () => {
    const { isValid } = runValidate({ ...estudianteValido, cedula: "123456" });
    expect(isValid).toBe(true);
  });

  test("CE-05 | invalido: cedula con menos de 6 caracteres", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, cedula: "12345" });
    expect(isValid).toBe(false);
    expect(errors.cedula).toBeDefined();
  });

  test("CE-06 | invalido: cedula vacia", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, cedula: "" });
    expect(isValid).toBe(false);
    expect(errors.cedula).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: correo
// =============================================================================
describe("CE — campo correo", () => {
  test("CE-07 | valido: correo con formato correcto", () => {
    const { isValid } = runValidate({ ...estudianteValido, correo: "test@gmail.com" });
    expect(isValid).toBe(true);
  });

  test("CE-08 | invalido: correo sin arroba", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, correo: "testgmail.com" });
    expect(isValid).toBe(false);
    expect(errors.correo).toBeDefined();
  });

  test("CE-09 | invalido: correo vacio", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, correo: "" });
    expect(isValid).toBe(false);
    expect(errors.correo).toBeDefined();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — CAMPO: contraseña
// =============================================================================
describe("CE — campo contraseña", () => {
  test("CE-10 | valido: contraseña con 6 o mas caracteres", () => {
    const { isValid } = runValidate({ ...estudianteValido, contraseña: "clave12" });
    expect(isValid).toBe(true);
  });

  test("CE-11 | invalido: contraseña con menos de 6 caracteres", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, contraseña: "abc" });
    expect(isValid).toBe(false);
    expect(errors.contraseña).toBeDefined();
  });

  test("CE-12 | invalido: contraseña vacia en registro", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, contraseña: "" });
    expect(isValid).toBe(false);
    expect(errors.contraseña).toBeDefined();
  });
});

// =============================================================================
// VALORES LIMITE — nombres (limite: 3 caracteres)
// =============================================================================
describe("VL — campo nombres (limite 3 chars)", () => {
  test("VL-01 | justo debajo del limite: 2 caracteres → invalido", () => {
    const { isValid } = runValidate({ ...estudianteValido, nombres: "Ab" });
    expect(isValid).toBe(false);
  });

  test("VL-02 | exactamente en el limite: 3 caracteres → valido", () => {
    const { isValid } = runValidate({ ...estudianteValido, nombres: "Ana" });
    expect(isValid).toBe(true);
  });

  test("VL-03 | justo encima del limite: 4 caracteres → valido", () => {
    const { isValid } = runValidate({ ...estudianteValido, nombres: "Anna" });
    expect(isValid).toBe(true);
  });
});

// =============================================================================
// VALORES LIMITE — contraseña (limite: 6 caracteres)
// =============================================================================
describe("VL — campo contraseña (limite 6 chars)", () => {
  test("VL-04 | 5 caracteres → invalido", () => {
    const { isValid } = runValidate({ ...estudianteValido, contraseña: "abc12" });
    expect(isValid).toBe(false);
  });

  test("VL-05 | exactamente 6 caracteres → valido", () => {
    const { isValid } = runValidate({ ...estudianteValido, contraseña: "abc123" });
    expect(isValid).toBe(true);
  });

  test("VL-06 | 7 caracteres → valido", () => {
    const { isValid } = runValidate({ ...estudianteValido, contraseña: "abc1234" });
    expect(isValid).toBe(true);
  });
});

// =============================================================================
// CAMINO BASICO — flujo del metodo validate()
// =============================================================================
describe("CB — camino basico del validate()", () => {
  test("CB-01 | camino feliz: todos los campos validos → retorna true sin errores", () => {
    const { isValid, errors } = runValidate(estudianteValido);
    expect(isValid).toBe(true);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test("CB-02 | multiples campos invalidos → retorna false con varios errores", () => {
    const { isValid, errors } = runValidate({ nombres: "", apellidos: "", cedula: "", correo: "", contraseña: "", telefono: "", estado: "si" });
    expect(isValid).toBe(false);
    expect(Object.keys(errors).length).toBeGreaterThan(3);
  });

  test("CB-03 | modo edicion sin contraseña → no valida contraseña", () => {
    const { isValid } = runValidate({ ...estudianteValido, contraseña: "" }, true);
    expect(isValid).toBe(true);
  });

  test("CB-04 | modo edicion con contraseña corta → si valida contraseña", () => {
    const { isValid, errors } = runValidate({ ...estudianteValido, contraseña: "ab" }, true);
    expect(isValid).toBe(false);
    expect(errors.contraseña).toBeDefined();
  });
});
