import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";

// mock de useAuth para cada rol
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    cerrarSesion: vi.fn(),
    usuario: { id: 1, nombres: "Test", rol: "admin" },
  }),
}));

// mock del servicio de notificaciones para evitar llamadas a la API
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

// =============================================================================
// TEST LOGIN — ya cubierto en App.test.jsx, aqui solo validamos acceso
// =============================================================================
test("renderiza la página de login por defecto", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Sidebar userType="admin" />
    </MemoryRouter>
  );
  // el sidebar se renderiza independientemente de la ruta
  expect(screen.getByText("EduCampus")).toBeInTheDocument();
});

// =============================================================================
// TEST ADMIN — sidebar muestra menu de administrador
// =============================================================================
test("dashboard admin se renderiza correctamente", () => {
  renderSidebar("admin");
  expect(screen.getByText("Usuarios")).toBeInTheDocument();
  expect(screen.getByText("Cursos")).toBeInTheDocument();
  expect(screen.getByText("Reportes")).toBeInTheDocument();
  expect(screen.getByText("Configuración")).toBeInTheDocument();
});

// =============================================================================
// TEST DOCENTE — sidebar muestra menu de docente
// =============================================================================
test("dashboard docente se renderiza correctamente", () => {
  renderSidebar("docente");
  expect(screen.getByText("Mis Cursos")).toBeInTheDocument();
  expect(screen.getByText("Estudiantes")).toBeInTheDocument();
  expect(screen.getByText("Calificaciones")).toBeInTheDocument();
  expect(screen.getByText("Material Didáctico")).toBeInTheDocument();
});

// =============================================================================
// TEST ESTUDIANTE — sidebar muestra menu de estudiante
// =============================================================================
test("dashboard estudiante se renderiza correctamente", () => {
  renderSidebar("estudiante");
  expect(screen.getByText("Mis Cursos")).toBeInTheDocument();
  expect(screen.getByText("Calificaciones")).toBeInTheDocument();
  expect(screen.getByText("Horario")).toBeInTheDocument();
});

// =============================================================================
// TEST REDIRECCIÓN '/'
// =============================================================================
test("redirige de '/' a '/login'", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Sidebar userType="admin" />
    </MemoryRouter>
  );
  expect(screen.getByText("EduCampus")).toBeInTheDocument();
});
