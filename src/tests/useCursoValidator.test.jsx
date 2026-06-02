import { renderHook, act } from "@testing-library/react";
import { useCursoValidator } from "../hooks/useCursoValidator";

const valido = {
  nombre: "Matematicas Avanzadas",
  cupo_estudiante: 30,
  id_docente: 1,
  horario: [{ dia: "Lunes", hora: "08:00" }],
  estado: true,
};

describe("useCursoValidator — pruebas unitarias", () => {
  test("UT-C01 | datos válidos retorna true", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { expect(result.current.validate(valido)).toBe(true); });
  });

  test("UT-C02 | nombre vacío genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, nombre: "" }); });
    expect(result.current.errors.nombre).toBeDefined();
  });

  test("UT-C03 | nombre muy corto genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, nombre: "Ma" }); });
    expect(result.current.errors.nombre).toBeDefined();
  });

  test("UT-C04 | cupo cero genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, cupo_estudiante: 0 }); });
    expect(result.current.errors.cupo_estudiante).toBeDefined();
  });

  test("UT-C05 | cupo negativo genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, cupo_estudiante: -5 }); });
    expect(result.current.errors.cupo_estudiante).toBeDefined();
  });

  test("UT-C06 | cupo decimal genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, cupo_estudiante: 10.5 }); });
    expect(result.current.errors.cupo_estudiante).toBeDefined();
  });

  test("UT-C07 | cupo texto genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, cupo_estudiante: "treinta" }); });
    expect(result.current.errors.cupo_estudiante).toBeDefined();
  });

  test("UT-C08 | sin docente genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, id_docente: null }); });
    expect(result.current.errors.id_docente).toBeDefined();
  });

  test("UT-C09 | horario vacío genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, horario: [] }); });
    expect(result.current.errors.horario).toBeDefined();
  });

  test("UT-C10 | horario null genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, horario: null }); });
    expect(result.current.errors.horario).toBeDefined();
  });

  test("UT-C11 | horario no array genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, horario: "Lunes 8am" }); });
    expect(result.current.errors.horario).toBeDefined();
  });

  test("UT-C12 | estado no booleano genera error", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, estado: "activo" }); });
    expect(result.current.errors.estado).toBeDefined();
  });

  test("UT-C13 | estado false es válido", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { expect(result.current.validate({ ...valido, estado: false })).toBe(true); });
  });

  test("UT-C14 | cupo mínimo de 1 es válido", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { expect(result.current.validate({ ...valido, cupo_estudiante: 1 })).toBe(true); });
  });

  test("UT-C15 | múltiples horarios son válidos", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => {
      expect(result.current.validate({
        ...valido,
        horario: [{ dia: "Lunes", hora: "08:00" }, { dia: "Miercoles", hora: "10:00" }],
      })).toBe(true);
    });
  });

  test("UT-C16 | retorna false con datos inválidos", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { expect(result.current.validate({ ...valido, nombre: "" })).toBe(false); });
  });

  test("UT-C17 | errores se limpian tras validación exitosa", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => { result.current.validate({ ...valido, nombre: "" }); });
    expect(result.current.errors.nombre).toBeDefined();
    act(() => { result.current.validate(valido); });
    expect(result.current.errors.nombre).toBeUndefined();
  });
});
