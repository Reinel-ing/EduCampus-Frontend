/**
 * int_flujo_roles.test.jsx
 * Pruebas de integracion — sidebar segun rol del usuario.
 * Estrategia: Integracion incremental descendente. Tecnica: Camino Basico (CB).
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    cerrarSesion: vi.fn(),
    usuario: { id: 1, nombres: "Usuario Prueba", rol: "admin" },
  }),
}));

vi.mock("../services/notificacionesService", () => ({
  contarNoLeidas: vi.fn().mockResolvedValue(0),
}));

function renderSidebar(userType) {
  return render(
    <MemoryRouter>
      <Sidebar userType={userType} />
    </MemoryRouter>
  );
}

// === INCREMENTO 1 — Sidebar con rol Admin ===
describe("INT — Incremento 1: Sidebar Admin", () => {

  test("INT-01 | rol admin → muestra opcion Usuarios", () => {
    renderSidebar("admin");
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
  });

  test("INT-02 | rol admin → muestra opcion Cursos", () => {
    renderSidebar("admin");
    expect(screen.getByText("Cursos")).toBeInTheDocument();
  });

  test("INT-03 | rol admin → muestra opcion Reportes", () => {
    renderSidebar("admin");
    expect(screen.getByText("Reportes")).toBeInTheDocument();
  });
});

// === INCREMENTO 2 — Sidebar con rol Docente ===
describe("INT — Incremento 2: Sidebar Docente", () => {

  test("INT-04 | rol docente → muestra opcion Mis Cursos", () => {
    renderSidebar("docente");
    expect(screen.getByText("Mis Cursos")).toBeInTheDocument();
  });

  test("INT-05 | rol docente → muestra opcion Calificaciones", () => {
    renderSidebar("docente");
    expect(screen.getByText("Calificaciones")).toBeInTheDocument();
  });

  test("INT-06 | rol docente → muestra opcion Material Didactico", () => {
    renderSidebar("docente");
    expect(screen.getByText("Material Didáctico")).toBeInTheDocument();
  });
});

// === INCREMENTO 3 — Sidebar con rol Estudiante ===
describe("INT — Incremento 3: Sidebar Estudiante", () => {

  test("INT-07 | rol estudiante → muestra opcion Mis Cursos", () => {
    renderSidebar("estudiante");
    expect(screen.getByText("Mis Cursos")).toBeInTheDocument();
  });

  test("INT-08 | rol estudiante → muestra opcion Horario", () => {
    renderSidebar("estudiante");
    expect(screen.getByText("Horario")).toBeInTheDocument();
  });
});

// === INCREMENTO 4 — Exclusividad de opciones entre roles ===
describe("INT — Incremento 4: Exclusividad de menus por rol", () => {

  test("INT-09 | rol estudiante NO muestra opcion exclusiva de admin (Configuracion)", () => {
    renderSidebar("estudiante");
    expect(screen.queryByText("Configuración")).not.toBeInTheDocument();
  });

  test("INT-10 | rol estudiante NO muestra opcion exclusiva de docente (Material Didactico)", () => {
    renderSidebar("estudiante");
    expect(screen.queryByText("Material Didáctico")).not.toBeInTheDocument();
  });
});
