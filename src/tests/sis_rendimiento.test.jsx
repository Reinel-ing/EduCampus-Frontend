import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderHook, act } from "@testing-library/react";
import { hashPassword } from "../utils/crypto";
import EstadoBadge from "../components/estudiante/EstadoBadge";
import StatCard from "../components/administrador/StatCard";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn(),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

describe("SIS — Pruebas de Rendimiento", () => {
  test("REN-01 | Login renderiza en menos de 1000ms", () => {
    const start = performance.now();
    render(<MemoryRouter><Login /></MemoryRouter>);
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });

  test("REN-02 | EstadoBadge renderiza en menos de 300ms", () => {
    const start = performance.now();
    render(<EstadoBadge tipo="aprobado" />);
    const end = performance.now();
    expect(end - start).toBeLessThan(300);
  });

  test("REN-03 | StatCard renderiza en menos de 300ms", () => {
    const start = performance.now();
    render(<StatCard title="Estudiantes" value={42} icon="👨‍🎓" />);
    const end = performance.now();
    expect(end - start).toBeLessThan(300);
  });

  test("REN-04 | hashPassword completa en menos de 1000ms", async () => {
    const start = performance.now();
    await hashPassword("contraseñaDeTest123");
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });

  test("REN-05 | renderizar 10 EstadoBadge consecutivos tarda menos de 1000ms", () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<EstadoBadge tipo="aprobado" />);
      unmount();
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });

  test("REN-06 | renderizar 10 StatCard consecutivos tarda menos de 1000ms", () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<StatCard title="T" value={i} icon="📊" />);
      unmount();
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });

  test("REN-07 | validación de estudiante se completa en menos de 100ms", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    const datos = {
      nombres: "Juan", apellidos: "Garcia", cedula: "1234567",
      correo: "juan@gmail.com", contraseña: "clave123",
      telefono: "3001234567", estado: true,
    };
    const start = performance.now();
    act(() => { result.current.validate(datos); });
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });

  test("REN-08 | 100 validaciones consecutivas se completan en menos de 2000ms", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    const datos = {
      nombres: "Juan", apellidos: "Garcia", cedula: "1234567",
      correo: "juan@gmail.com", contraseña: "clave123",
      telefono: "3001234567", estado: true,
    };
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      act(() => { result.current.validate(datos); });
    }
    const end = performance.now();
    expect(end - start).toBeLessThan(2000);
  });
});
