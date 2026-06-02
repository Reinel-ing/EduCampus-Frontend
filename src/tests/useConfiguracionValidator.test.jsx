import { renderHook, act } from "@testing-library/react";
import { useConfiguracionValidator } from "../hooks/useConfiguracionValidator";

const valido = {
  nombre_institucion: "Universidad EduCampus",
  email_contacto: "admin@educampus.edu.co",
  ano_academico: "2025-2026",
};

describe("useConfiguracionValidator — pruebas unitarias", () => {
  test("UT-CF01 | datos válidos retorna true", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { expect(result.current.validate(valido)).toBe(true); });
  });

  test("UT-CF02 | nombre institución vacío genera error", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, nombre_institucion: "" }); });
    expect(result.current.errors.nombre_institucion).toBeDefined();
  });

  test("UT-CF03 | nombre institución muy corto genera error", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, nombre_institucion: "AB" }); });
    expect(result.current.errors.nombre_institucion).toBeDefined();
  });

  test("UT-CF04 | email contacto vacío genera error", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, email_contacto: "" }); });
    expect(result.current.errors.email_contacto).toBeDefined();
  });

  test("UT-CF05 | email contacto inválido genera error", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, email_contacto: "no-es-email" }); });
    expect(result.current.errors.email_contacto).toBeDefined();
  });

  test("UT-CF06 | año académico vacío genera error", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, ano_academico: "" }); });
    expect(result.current.errors.ano_academico).toBeDefined();
  });

  test("UT-CF07 | año académico con formato incorrecto genera error", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, ano_academico: "2025" }); });
    expect(result.current.errors.ano_academico).toBeDefined();
  });

  test("UT-CF08 | año académico con formato YYYY-YYYY es válido", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { expect(result.current.validate({ ...valido, ano_academico: "2026-2027" })).toBe(true); });
  });

  test("UT-CF09 | retorna false con datos inválidos", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { expect(result.current.validate({ nombre_institucion: "", email_contacto: "", ano_academico: "" })).toBe(false); });
  });

  test("UT-CF10 | clearErrors limpia todos los errores", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ nombre_institucion: "", email_contacto: "", ano_academico: "" }); });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    act(() => { result.current.clearErrors(); });
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  test("UT-CF11 | múltiples errores simultáneos", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ nombre_institucion: "", email_contacto: "malo", ano_academico: "xxx" }); });
    expect(Object.keys(result.current.errors).length).toBe(3);
  });

  test("UT-CF12 | nombre con exactamente 3 caracteres es válido", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { expect(result.current.validate({ ...valido, nombre_institucion: "UPC" })).toBe(true); });
  });

  test("UT-CF13 | año académico con letras es inválido", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, ano_academico: "abcd-efgh" }); });
    expect(result.current.errors.ano_academico).toBeDefined();
  });

  test("UT-CF14 | email con subdominio es válido", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { expect(result.current.validate({ ...valido, email_contacto: "info@uni.edu.co" })).toBe(true); });
  });

  test("UT-CF15 | errores se limpian tras validación exitosa", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => { result.current.validate({ ...valido, nombre_institucion: "" }); });
    expect(result.current.errors.nombre_institucion).toBeDefined();
    act(() => { result.current.validate(valido); });
    expect(result.current.errors.nombre_institucion).toBeUndefined();
  });
});
