import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    loading: false,
    usuario: null,
    iniciarSesion: jest.fn(),
    cerrarSesion: jest.fn(),
  }),
}));

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const MockAdmin    = () => <div>Panel Admin</div>;
const MockDocente  = () => <div>Panel Docente</div>;
const MockLogin    = () => <div>Pagina Login</div>;

const renderWithAuth = (path, autenticado = false, rol = null) => {
  jest.spyOn(require("../context/AuthContext"), "useAuth").mockReturnValue({
    isAuthenticated: autenticado,
    loading: false,
    usuario: rol ? { rol } : null,
    iniciarSesion: jest.fn(),
    cerrarSesion: jest.fn(),
  });

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<MockLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={["admin"]}>
            <MockAdmin />
          </ProtectedRoute>
        } />
        <Route path="/docente/dashboard" element={
          <ProtectedRoute roles={["docente"]}>
            <MockDocente />
          </ProtectedRoute>
        } />
      </Routes>
    </MemoryRouter>
  );
};

describe("AppRoles — control de acceso por rol", () => {
  test("AR-01 | usuario no autenticado es redirigido al login", () => {
    renderWithAuth("/admin/dashboard", false);
    expect(screen.getByText("Pagina Login")).toBeInTheDocument();
  });

  test("AR-02 | admin autenticado accede al panel admin", () => {
    renderWithAuth("/admin/dashboard", true, "admin");
    expect(screen.getByText("Panel Admin")).toBeInTheDocument();
  });

  test("AR-03 | docente autenticado accede al panel docente", () => {
    renderWithAuth("/docente/dashboard", true, "docente");
    expect(screen.getByText("Panel Docente")).toBeInTheDocument();
  });

  test("AR-04 | docente no puede acceder al panel admin — redirige a login", () => {
    renderWithAuth("/admin/dashboard", false, "docente");
    expect(screen.getByText("Pagina Login")).toBeInTheDocument();
  });

  test("AR-05 | admin no puede acceder al panel docente — redirige a login", () => {
    renderWithAuth("/docente/dashboard", false, "admin");
    expect(screen.getByText("Pagina Login")).toBeInTheDocument();
  });
});
