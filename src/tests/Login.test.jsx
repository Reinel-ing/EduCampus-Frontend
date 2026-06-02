import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock del contexto de autenticación
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn().mockResolvedValue({ error: false }),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login — pruebas de componente", () => {
  test("CP-L01 | muestra el título EduCampus", () => {
    renderLogin();
    expect(screen.getByText("EduCampus")).toBeInTheDocument();
  });

  test("CP-L02 | muestra campo de correo", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  test("CP-L03 | muestra campo de contraseña", () => {
    renderLogin();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test("CP-L04 | muestra botón Ingresar", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  test("CP-L05 | muestra botón Limpiar", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /limpiar/i })).toBeInTheDocument();
  });

  test("CP-L06 | correo inválido muestra error", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "correo-invalido" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "clave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/solo se permiten correos/i)).toBeInTheDocument();
  });

  test("CP-L07 | campos vacíos muestran error de validación", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
  });

  test("CP-L08 | botón Limpiar vacía los campos", () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(screen.getByLabelText(/correo electrónico/i).value).toBe("");
  });
});
