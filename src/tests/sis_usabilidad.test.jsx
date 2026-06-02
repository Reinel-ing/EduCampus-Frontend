import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn(),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

const renderLogin = () =>
  render(<MemoryRouter><Login /></MemoryRouter>);

describe("SIS — Pruebas de Usabilidad", () => {
  test("SIS-U01 | el formulario tiene un título visible", () => {
    renderLogin();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });

  test("SIS-U02 | los campos tienen etiquetas descriptivas", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test("SIS-U03 | el botón principal tiene texto descriptivo", () => {
    renderLogin();
    const btn = screen.getByRole("button", { name: /ingresar/i });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent.length).toBeGreaterThan(3);
  });

  test("SIS-U04 | existe un botón de acción secundaria (Limpiar)", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /limpiar/i })).toBeInTheDocument();
  });

  test("SIS-U05 | el campo de contraseña es de tipo password", () => {
    renderLogin();
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute("type", "password");
  });

  test("SIS-U06 | muestra información de contacto en el footer", () => {
    renderLogin();
    expect(screen.getByText(/contacta al administrador/i)).toBeInTheDocument();
  });

  test("SIS-U07 | muestra los tres roles disponibles", () => {
    renderLogin();
    expect(screen.getAllByText(/administrador/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/docente/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/estudiante/i).length).toBeGreaterThan(0);
  });

  test("SIS-U08 | el placeholder del correo orienta al usuario", () => {
    renderLogin();
    const input = screen.getByLabelText(/correo electrónico/i);
    expect(input.placeholder).toMatch(/@gmail|@outlook/i);
  });
});
