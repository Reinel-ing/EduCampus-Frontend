import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockIniciarSesion = jest.fn();
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: mockIniciarSesion,
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

const renderLogin = () =>
  render(<MemoryRouter><Login /></MemoryRouter>);

describe("INT — Flujo de login", () => {
  beforeEach(() => { mockIniciarSesion.mockReset(); });

  test("INT-L01 | campos vacíos bloquean el envío", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
    expect(mockIniciarSesion).not.toHaveBeenCalled();
  });

  test("INT-L02 | correo no gmail/outlook bloquea el envío", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "user@yahoo.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/solo se permiten correos/i)).toBeInTheDocument();
    expect(mockIniciarSesion).not.toHaveBeenCalled();
  });

  test("INT-L03 | credenciales correctas llaman al servicio de autenticación", async () => {
    mockIniciarSesion.mockResolvedValue({ error: false });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "admin@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => expect(mockIniciarSesion).toHaveBeenCalledWith("admin@gmail.com", "clave123"));
  });

  test("INT-L04 | error del servidor muestra mensaje de error", async () => {
    mockIniciarSesion.mockResolvedValue({ error: true, message: "Credenciales incorrectas" });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "admin@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "incorrecta" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/Credenciales incorrectas/i)).toBeInTheDocument();
  });

  test("INT-L05 | botón Limpiar resetea todos los campos y errores", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "test@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(screen.getByLabelText(/correo electrónico/i).value).toBe("");
    expect(screen.queryByText(/completa todos los campos/i)).not.toBeInTheDocument();
  });
});
