import { renderHook, act } from "@testing-library/react";
import { useDocenteValidator } from "../hooks/useDocenteValidator";

const valido = {
  nombres: "Maria",
  apellidos: "Lopez",
  cedula: "7654321",
  correo: "maria@gmail.com",
  contraseña: "clave123",
  especialidad: "Matematicas",
  estado: true,
};

describe("useDocenteValidator — pruebas unitarias", () => {
  test("UT-D01 | datos válidos retorna true", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { expect(result.current.validate(valido)).toBe(true); });
  });

  test("UT-D02 | nombre vacío genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, nombres: "" }); });
    expect(result.current.errors.nombres).toBeDefined();
  });

  test("UT-D03 | nombre muy corto genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, nombres: "Jo" }); });
    expect(result.current.errors.nombres).toBeDefined();
  });

  test("UT-D04 | apellido vacío genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, apellidos: "" }); });
    expect(result.current.errors.apellidos).toBeDefined();
  });

  test("UT-D05 | cédula muy corta genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, cedula: "12" }); });
    expect(result.current.errors.cedula).toBeDefined();
  });

  test("UT-D06 | correo inválido genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, correo: "invalido" }); });
    expect(result.current.errors.correo).toBeDefined();
  });

  test("UT-D07 | correo vacío genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, correo: "" }); });
    expect(result.current.errors.correo).toBeDefined();
  });

  test("UT-D08 | contraseña vacía en creación genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, contraseña: "" }); });
    expect(result.current.errors.contraseña).toBeDefined();
  });

  test("UT-D09 | contraseña corta en creación genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, contraseña: "abc" }); });
    expect(result.current.errors.contraseña).toBeDefined();
  });

  test("UT-D10 | en edición contraseña vacía no genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    let ok;
    act(() => { ok = result.current.validate({ ...valido, contraseña: "" }, true); });
    expect(result.current.errors.contraseña).toBeUndefined();
    expect(ok).toBe(true);
  });

  test("UT-D11 | en edición contraseña corta genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, contraseña: "12" }, true); });
    expect(result.current.errors.contraseña).toBeDefined();
  });

  test("UT-D12 | especialidad vacía genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, especialidad: "" }); });
    expect(result.current.errors.especialidad).toBeDefined();
  });

  test("UT-D13 | especialidad muy corta genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, especialidad: "IT" }); });
    expect(result.current.errors.especialidad).toBeDefined();
  });

  test("UT-D14 | estado no booleano genera error", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, estado: "si" }); });
    expect(result.current.errors.estado).toBeDefined();
  });

  test("UT-D15 | estado false es válido", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { expect(result.current.validate({ ...valido, estado: false })).toBe(true); });
  });

  test("UT-D16 | múltiples errores a la vez", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ nombres: "", apellidos: "", cedula: "", correo: "", contraseña: "", especialidad: "", estado: null }); });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(3);
  });

  test("UT-D17 | retorna false con datos inválidos", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { expect(result.current.validate({ ...valido, nombres: "" })).toBe(false); });
  });

  test("UT-D18 | errores se limpian tras validación exitosa", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { result.current.validate({ ...valido, especialidad: "" }); });
    expect(result.current.errors.especialidad).toBeDefined();
    act(() => { result.current.validate(valido); });
    expect(result.current.errors.especialidad).toBeUndefined();
  });

  test("UT-D19 | correo con formato correcto es aceptado", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => { expect(result.current.validate({ ...valido, correo: "docente@hotmail.com" })).toBe(true); });
  });
});
