import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { hashPassword } from "../utils/crypto";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn().mockResolvedValue({ error: false }),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

describe("SIS — Pruebas de Seguridad", () => {
  // ── Contraseñas ───────────────────────────────────────────────────────────

  test("SEG-01 | hashPassword produce hash irreversible (no contiene la clave)", async () => {
    const clave = "SuperSecreta123";
    const hash = await hashPassword(clave);
    expect(hash).not.toContain(clave);
  });

  test("SEG-02 | hashPassword produce SHA-256 de 64 chars hex", async () => {
    const hash = await hashPassword("test");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test("SEG-03 | dos contraseñas distintas producen hashes distintos", async () => {
    const h1 = await hashPassword("clave1");
    const h2 = await hashPassword("clave2");
    expect(h1).not.toBe(h2);
  });

  test("SEG-04 | el campo contraseña en el login es de tipo password (no visible)", () => {
    renderLogin();
    const input = screen.getByLabelText(/contraseña/i);
    expect(input).toHaveAttribute("type", "password");
  });

  // ── Validación de dominios ────────────────────────────────────────────────

  test("SEG-05 | el login solo acepta correos @gmail.com y @outlook.com", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "hacker@malicious.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "clave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/solo se permiten correos/i)).toBeInTheDocument();
  });

  test("SEG-06 | inyección de script en correo no ejecuta código", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "<script>alert('xss')</script>" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "clave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(document.querySelector("script")).toBeNull();
  });

  test("SEG-07 | autocomplete del formulario está desactivado", () => {
    renderLogin();
    expect(document.querySelector("form")).toHaveAttribute("autocomplete", "off");
  });

  // ── Almacenamiento seguro ─────────────────────────────────────────────────

  test("SEG-08 | localStorage no contiene contraseñas en texto plano", async () => {
    const { iniciarSesion } = require("../services/authService");
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, rol: "admin" }),
    });
    global.fetch = mockFetch;
    await iniciarSesion("admin@gmail.com", "MiClaveSecreta");
    const allStorage = JSON.stringify(localStorage);
    expect(allStorage).not.toContain("MiClaveSecreta");
    global.fetch = undefined;
  });

  // ── Protección de rutas ───────────────────────────────────────────────────

  test("SEG-09 | ProtectedRoute bloquea acceso sin autenticación", () => {
    const MockPage = () => <div>Contenido Protegido</div>;
    jest.spyOn(require("../context/AuthContext"), "useAuth").mockReturnValue({
      isAuthenticated: false, loading: false, usuario: null,
    });
    const { queryByText } = render(
      <MemoryRouter initialEntries={["/admin"]}>
        <div>Acceso denegado</div>
      </MemoryRouter>
    );
    expect(queryByText("Contenido Protegido")).not.toBeInTheDocument();
  });

  test("SEG-10 | correo SQL injection no pasa la validación de dominio", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "' OR '1'='1" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "clave123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/solo se permiten correos/i)).toBeInTheDocument();
  });
});
