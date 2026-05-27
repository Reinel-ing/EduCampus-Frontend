/**
 * int_flujo_login.test.jsx
 * Pruebas de integracion — flujo de inicio de sesion.
 * Estrategia: Integracion incremental ascendente. Tecnica: Camino Basico (CB).
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

const mockIniciarSesion = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ iniciarSesion: mockIniciarSesion }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockIniciarSesion.mockReset();
});

// === NIVEL 1 + NIVEL 2 — Formulario + Validacion (incremento ascendente) ===
describe("INT — Formulario + Validacion (incremento 1 y 2)", () => {

  test("INT-01 | correo y contrasena vacios bloquean el envio al contexto", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
    });
    expect(mockIniciarSesion).not.toHaveBeenCalled();
  });

  test("INT-02 | correo con dominio no permitido bloquea el envio al contexto", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "usuario@yahoo.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "clave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(screen.getByText(/solo se permiten correos/i)).toBeInTheDocument();
    });
    expect(mockIniciarSesion).not.toHaveBeenCalled();
  });

  test("INT-03 | boton Limpiar resetea correo y contrasena al mismo tiempo", () => {
    renderLogin();
    const inputCorreo = screen.getByLabelText(/correo electrónico/i);
    const inputClave  = screen.getByLabelText(/contraseña/i);
    fireEvent.change(inputCorreo, { target: { value: "test@gmail.com" } });
    fireEvent.change(inputClave,  { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(inputCorreo.value).toBe("");
    expect(inputClave.value).toBe("");
  });
});

// === NIVEL 3 — Formulario + Validacion + AuthContext (incremento completo) ===
describe("INT — Formulario + Validacion + AuthContext (incremento 3)", () => {

  test("INT-04 | formulario valido invoca iniciarSesion con correo y contrasena correctos", async () => {
    mockIniciarSesion.mockResolvedValue({ rol: "estudiante", id: 1 });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "ana@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "clave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(mockIniciarSesion).toHaveBeenCalledTimes(1);
    });
    const [correoArg, claveArg] = mockIniciarSesion.mock.calls[0];
    expect(correoArg).toBe("ana@gmail.com");
    expect(claveArg).toBe("clave123");
  });

  test("INT-05 | formulario valido con outlook.com invoca iniciarSesion con los datos correctos", async () => {
    mockIniciarSesion.mockResolvedValue({ rol: "docente", id: 2 });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "profe@outlook.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "DocClave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(mockIniciarSesion).toHaveBeenCalledTimes(1);
    });
    const [correoArg, claveArg] = mockIniciarSesion.mock.calls[0];
    expect(correoArg).toBe("profe@outlook.com");
    expect(claveArg).toBe("DocClave123");
  });
});
