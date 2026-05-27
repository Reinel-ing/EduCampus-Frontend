/**
 * sis_portabilidad.test.jsx
 * Pruebas de sistema — Portabilidad.
 * Verifica que los componentes se renderizan en distintos contextos y roles.
 * Tecnica: Clases de Equivalencia (CE), Valores Limite (VL).
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import Sidebar from "../components/shared/Sidebar";
import EstadoBadge from "../components/estudiante/EstadoBadge";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: vi.fn(),
    cerrarSesion:  vi.fn(),
    usuario: { id: 1, nombres: "Prueba", rol: "admin" },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("../services/notificacionesService", () => ({
  contarNoLeidas: vi.fn().mockResolvedValue(0),
}));

// === CE — Portabilidad del componente Login en cualquier entorno ===
describe("SIS-PORT | Login portable en cualquier entorno", () => {

  test("SIS-01 | Login se renderiza sin errores en entorno jsdom", () => {
    expect(() =>
      render(<MemoryRouter><Login /></MemoryRouter>)
    ).not.toThrow();
  });

  test("SIS-02 | Login muestra el titulo EduCampus como encabezado principal", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText("EduCampus")).toBeInTheDocument();
  });
});

// === CE — Portabilidad del componente Sidebar con cualquier rol ===
describe("SIS-PORT | Sidebar portable para todos los roles", () => {

  test("SIS-03 | Sidebar con rol admin se renderiza sin errores", () => {
    expect(() =>
      render(<MemoryRouter><Sidebar userType="admin" /></MemoryRouter>)
    ).not.toThrow();
  });

  test("SIS-04 | Sidebar con rol docente se renderiza sin errores", () => {
    expect(() =>
      render(<MemoryRouter><Sidebar userType="docente" /></MemoryRouter>)
    ).not.toThrow();
  });

  test("SIS-05 | Sidebar con rol estudiante se renderiza sin errores", () => {
    expect(() =>
      render(<MemoryRouter><Sidebar userType="estudiante" /></MemoryRouter>)
    ).not.toThrow();
  });
});

// === VL — Portabilidad de EstadoBadge con valores limite ===
describe("SIS-PORT | EstadoBadge portable con todos sus tipos", () => {

  test("SIS-06 | EstadoBadge tipo='aprobado' se renderiza sin errores", () => {
    expect(() => render(<EstadoBadge tipo="aprobado" />)).not.toThrow();
  });

  test("SIS-07 | EstadoBadge tipo='nota' con nota=3.0 se renderiza sin errores", () => {
    expect(() => render(<EstadoBadge tipo="nota" nota={3.0} />)).not.toThrow();
  });

  test("SIS-08 | EstadoBadge con tipo desconocido no lanza excepcion", () => {
    expect(() => render(<EstadoBadge tipo="invalido" />)).not.toThrow();
  });
});
