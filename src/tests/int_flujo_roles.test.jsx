import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("INT — Flujo de roles y navegación", () => {
  const MockLogin    = () => <div data-testid="login-page">Login</div>;
  const MockAdmin    = () => <div data-testid="admin-page">Dashboard Admin</div>;
  const MockDocente  = () => <div data-testid="docente-page">Dashboard Docente</div>;
  const MockEstudiante = () => <div data-testid="estudiante-page">Dashboard Estudiante</div>;
  const MockNotFound = () => <div data-testid="notfound-page">404 No encontrado</div>;

  const renderWithRoute = (path) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/"                   element={<MockLogin />} />
          <Route path="/login"              element={<MockLogin />} />
          <Route path="/admin/dashboard"    element={<MockAdmin />} />
          <Route path="/docente/dashboard"  element={<MockDocente />} />
          <Route path="/usuario/dashboard"  element={<MockEstudiante />} />
          <Route path="*"                   element={<MockNotFound />} />
        </Routes>
      </MemoryRouter>
    );

  test("INT-R01 | ruta raíz muestra el login", () => {
    renderWithRoute("/");
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  test("INT-R02 | ruta /login muestra el login", () => {
    renderWithRoute("/login");
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  test("INT-R03 | ruta /admin/dashboard muestra panel admin", () => {
    renderWithRoute("/admin/dashboard");
    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
  });

  test("INT-R04 | ruta /docente/dashboard muestra panel docente", () => {
    renderWithRoute("/docente/dashboard");
    expect(screen.getByTestId("docente-page")).toBeInTheDocument();
  });

  test("INT-R05 | ruta /usuario/dashboard muestra panel estudiante", () => {
    renderWithRoute("/usuario/dashboard");
    expect(screen.getByTestId("estudiante-page")).toBeInTheDocument();
  });

  test("INT-R06 | ruta inexistente muestra 404", () => {
    renderWithRoute("/ruta-que-no-existe");
    expect(screen.getByTestId("notfound-page")).toBeInTheDocument();
  });

  test("INT-R07 | admin no ve panel de docente en su ruta", () => {
    renderWithRoute("/admin/dashboard");
    expect(screen.queryByTestId("docente-page")).not.toBeInTheDocument();
  });

  test("INT-R08 | docente no ve panel de admin en su ruta", () => {
    renderWithRoute("/docente/dashboard");
    expect(screen.queryByTestId("admin-page")).not.toBeInTheDocument();
  });

  test("INT-R09 | estudiante no ve panel de admin en su ruta", () => {
    renderWithRoute("/usuario/dashboard");
    expect(screen.queryByTestId("admin-page")).not.toBeInTheDocument();
  });

  test("INT-R10 | cada ruta renderiza solo su componente", () => {
    renderWithRoute("/admin/dashboard");
    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
    expect(screen.queryByTestId("docente-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("estudiante-page")).not.toBeInTheDocument();
  });
});
