import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";

/* MockAuthProvider para simular roles */
const MockAuthProvider = ({ role, children }) => {
  const mockValue = { user: { role } }; // admin, docente, estudiante
  return <AuthProvider value={mockValue}>{children}</AuthProvider>;
};

/* =========================
   TEST LOGIN
========================= */
test("renderiza la página de login por defecto", () => {
  render(<App />);
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
});

/* =========================
   TEST ADMIN
========================= */
test("dashboard admin se renderiza correctamente", () => {
  render(
    <MockAuthProvider role="admin">
      <App />
    </MockAuthProvider>
  );
  expect(screen.getByText(/dashboard admin/i)).toBeInTheDocument();
  expect(screen.getByText(/gestión de usuarios/i)).toBeInTheDocument();
  expect(screen.getByText(/gestión de cursos/i)).toBeInTheDocument();
  expect(screen.getByText(/reportes/i)).toBeInTheDocument();
  expect(screen.getByText(/configuración/i)).toBeInTheDocument();
});

/* =========================
   TEST DOCENTE
========================= */
test("dashboard docente se renderiza correctamente", () => {
  render(
    <MockAuthProvider role="docente">
      <App />
    </MockAuthProvider>
  );
  expect(screen.getByText(/dashboard docente/i)).toBeInTheDocument();
  expect(screen.getByText(/mis cursos/i)).toBeInTheDocument();
  expect(screen.getByText(/lista estudiantes/i)).toBeInTheDocument();
  expect(screen.getByText(/calificaciones/i)).toBeInTheDocument();
  expect(screen.getByText(/material didáctico/i)).toBeInTheDocument();
});

/* =========================
   TEST ESTUDIANTE
========================= */
test("dashboard estudiante se renderiza correctamente", () => {
  render(
    <MockAuthProvider role="estudiante">
      <App />
    </MockAuthProvider>
  );
  expect(screen.getByText(/dashboard estudiante/i)).toBeInTheDocument();
  expect(screen.getByText(/mis cursos/i)).toBeInTheDocument();
  expect(screen.getByText(/calificaciones/i)).toBeInTheDocument();
  expect(screen.getByText(/horario/i)).toBeInTheDocument();
});

/* =========================
   TEST REDIRECCIÓN '/'
========================= */
test("redirige de '/' a '/login'", () => {
  render(<App />);
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
});