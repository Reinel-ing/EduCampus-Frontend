import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ─── Mocks globales ──────────────────────────────────────────────────────────
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    usuario: { nombres: "Reinel", rol: "admin" },
    cerrarSesion: jest.fn(),
    isAuthenticated: true,
    loading: false,
  }),
}));

jest.mock("../services/notificacionesService", () => ({
  contarNoLeidas: jest.fn().mockResolvedValue(0),
}));

import Header from "../components/shared/Header";
import Sidebar from "../components/shared/Sidebar";
import AdminLayout from "../components/layout/AdminLayout";
import DocenteLayout from "../components/layout/DocenteLayout";
import UsuarioLayout from "../components/layout/UsuarioLayout";

// ─── Header ──────────────────────────────────────────────────────────────────
describe("Header — pruebas de componente", () => {
  const renderHeader = (title = "Panel de Administración") =>
    render(<MemoryRouter><Header title={title} /></MemoryRouter>);

  test("CP-HD01 | muestra el título del panel", () => {
    renderHeader("Panel Admin");
    expect(screen.getByText("Panel Admin")).toBeInTheDocument();
  });

  test("CP-HD02 | muestra el nombre del usuario", () => {
    renderHeader();
    expect(screen.getByText(/Reinel/i)).toBeInTheDocument();
  });

  test("CP-HD03 | muestra el indicador En línea", () => {
    renderHeader();
    expect(screen.getByText(/En línea/i)).toBeInTheDocument();
  });

  test("CP-HD04 | muestra el botón de cerrar sesión", () => {
    renderHeader();
    expect(screen.getByTitle(/cerrar sesión/i)).toBeInTheDocument();
  });

  test("CP-HD05 | muestra el avatar con inicial del nombre", () => {
    renderHeader();
    expect(screen.getByText("R")).toBeInTheDocument(); // inicial de "Reinel"
  });

  test("CP-HD06 | renderiza sin errores", () => {
    expect(() => renderHeader()).not.toThrow();
  });
});

// ─── Sidebar ─────────────────────────────────────────────────────────────────
describe("Sidebar — pruebas de componente", () => {
  const renderSidebar = () =>
    render(<MemoryRouter><Sidebar /></MemoryRouter>);

  test("CP-SB01 | renderiza sin errores", () => {
    expect(() => renderSidebar()).not.toThrow();
  });

  test("CP-SB02 | muestra el nombre EduCampus", () => {
    renderSidebar();
    expect(screen.getAllByText(/EduCampus/i).length).toBeGreaterThan(0);
  });

  test("CP-SB03 | muestra opciones de navegación", () => {
    renderSidebar();
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
  });

  test("CP-SB04 | muestra la sección de notificaciones", () => {
    renderSidebar();
    expect(screen.getByText(/Notificaciones/i)).toBeInTheDocument();
  });
});

// ─── Layouts ─────────────────────────────────────────────────────────────────
describe("AdminLayout — pruebas de componente", () => {
  test("CP-AL01 | renderiza sin errores", () => {
    expect(() => render(<MemoryRouter><AdminLayout /></MemoryRouter>)).not.toThrow();
  });

  test("CP-AL02 | muestra el título del panel admin", () => {
    render(<MemoryRouter><AdminLayout /></MemoryRouter>);
    expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
  });
});

describe("DocenteLayout — pruebas de componente", () => {
  test("CP-DL01 | renderiza sin errores", () => {
    expect(() => render(<MemoryRouter><DocenteLayout /></MemoryRouter>)).not.toThrow();
  });

  test("CP-DL02 | muestra el título del panel docente", () => {
    render(<MemoryRouter><DocenteLayout /></MemoryRouter>);
    expect(screen.getByText(/Panel de Docente/i)).toBeInTheDocument();
  });
});

describe("UsuarioLayout — pruebas de componente", () => {
  test("CP-UL01 | renderiza sin errores", () => {
    expect(() => render(<MemoryRouter><UsuarioLayout /></MemoryRouter>)).not.toThrow();
  });

  test("CP-UL02 | muestra el título del panel estudiante", () => {
    render(<MemoryRouter><UsuarioLayout /></MemoryRouter>);
    expect(screen.getByText(/Panel del Estudiante/i)).toBeInTheDocument();
  });
});
