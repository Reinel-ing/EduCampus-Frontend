import { renderHook, act } from "@testing-library/react";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";

const valido = {
  nombres: "Carlos",
  apellidos: "Perez",
  cedula: "1234567",
  correo: "carlos@gmail.com",
  contraseña: "clave123",
  telefono: "3001234567",
  estado: true,
};

describe("useEstudianteValidator — pruebas unitarias", () => {
  test("UT-E01 | datos válidos retorna true", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { expect(result.current.validate(valido)).toBe(true); });
  });

  test("UT-E02 | nombre vacío genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, nombres: "" }); });
    expect(result.current.errors.nombres).toBeDefined();
  });

  test("UT-E03 | nombre muy corto genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, nombres: "Jo" }); });
    expect(result.current.errors.nombres).toBeDefined();
  });

  test("UT-E04 | apellido vacío genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, apellidos: "" }); });
    expect(result.current.errors.apellidos).toBeDefined();
  });

  test("UT-E05 | apellido muy corto genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, apellidos: "Pe" }); });
    expect(result.current.errors.apellidos).toBeDefined();
  });

  test("UT-E06 | cédula vacía genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, cedula: "" }); });
    expect(result.current.errors.cedula).toBeDefined();
  });

  test("UT-E07 | cédula muy corta genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, cedula: "123" }); });
    expect(result.current.errors.cedula).toBeDefined();
  });

  test("UT-E08 | correo inválido genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, correo: "no-es-correo" }); });
    expect(result.current.errors.correo).toBeDefined();
  });

  test("UT-E09 | correo vacío genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, correo: "" }); });
    expect(result.current.errors.correo).toBeDefined();
  });

  test("UT-E10 | contraseña vacía en creación genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, contraseña: "" }); });
    expect(result.current.errors.contraseña).toBeDefined();
  });

  test("UT-E11 | contraseña corta en creación genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, contraseña: "abc" }); });
    expect(result.current.errors.contraseña).toBeDefined();
  });

  test("UT-E12 | en edición contraseña vacía no genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    let ok;
    act(() => { ok = result.current.validate({ ...valido, contraseña: "" }, true); });
    expect(result.current.errors.contraseña).toBeUndefined();
    expect(ok).toBe(true);
  });

  test("UT-E13 | en edición contraseña corta genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, contraseña: "ab" }, true); });
    expect(result.current.errors.contraseña).toBeDefined();
  });

  test("UT-E14 | teléfono vacío genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, telefono: "" }); });
    expect(result.current.errors.telefono).toBeDefined();
  });

  test("UT-E15 | teléfono muy corto genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, telefono: "123" }); });
    expect(result.current.errors.telefono).toBeDefined();
  });

  test("UT-E16 | estado no booleano genera error", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, estado: "activo" }); });
    expect(result.current.errors.estado).toBeDefined();
  });

  test("UT-E17 | estado false es válido", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { expect(result.current.validate({ ...valido, estado: false })).toBe(true); });
  });

  test("UT-E18 | múltiples errores a la vez", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ nombres: "", apellidos: "", cedula: "", correo: "", contraseña: "", telefono: "", estado: null }); });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(3);
  });

  test("UT-E19 | correo con dominio outlook es válido", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { expect(result.current.validate({ ...valido, correo: "user@outlook.com" })).toBe(true); });
  });

  test("UT-E20 | nombre con exactamente 3 caracteres es válido", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { expect(result.current.validate({ ...valido, nombres: "Ana" })).toBe(true); });
  });

  test("UT-E21 | cédula con exactamente 6 caracteres es válida", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { expect(result.current.validate({ ...valido, cedula: "123456" })).toBe(true); });
  });

  test("UT-E22 | errores se limpian en validación exitosa", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => { result.current.validate({ ...valido, nombres: "" }); });
    expect(result.current.errors.nombres).toBeDefined();
    act(() => { result.current.validate(valido); });
    expect(result.current.errors.nombres).toBeUndefined();
  });
});
