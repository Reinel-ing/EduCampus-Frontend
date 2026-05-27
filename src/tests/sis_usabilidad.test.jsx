/**
 * sis_usabilidad.test.jsx
 * Pruebas de sistema — Usabilidad.
 * Verifica etiquetas, mensajes de error e indicadores visuales de estado.
 * Tecnica: Clases de Equivalencia (CE).
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import EstadoBadge from "../components/estudiante/EstadoBadge";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ iniciarSesion: vi.fn() }),
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

// === CRITERIO: Etiquetas visibles en campos de entrada (usabilidad basica) ===
describe("SIS-USAB | Etiquetas y campos accesibles", () => {

  test("SIS-01 | campo correo tiene etiqueta visible asociada", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  test("SIS-02 | campo contrasena tiene etiqueta visible asociada", () => {
    renderLogin();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test("SIS-03 | boton principal tiene texto descriptivo Ingresar", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  test("SIS-04 | boton secundario tiene texto descriptivo Limpiar", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /limpiar/i })).toBeInTheDocument();
  });
});

// === CRITERIO: Mensajes de retroalimentacion claros al usuario ===
describe("SIS-USAB | Mensajes de error visibles y comprensibles", () => {

  test("SIS-05 | campos vacios al enviar → mensaje de error legible aparece en pantalla", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
    });
  });

  test("SIS-06 | correo con dominio invalido → mensaje especifico aparece en pantalla", async () => {
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
  });
});

// === CRITERIO: Indicadores visuales de estado con texto legible ===
describe("SIS-USAB | Indicadores de estado con texto identificable", () => {

  test("SIS-07 | EstadoBadge tipo='aprobado' muestra texto Aprobado", () => {
    render(<EstadoBadge tipo="aprobado" />);
    expect(screen.getByText("Aprobado")).toBeInTheDocument();
  });

  test("SIS-08 | EstadoBadge tipo='reprobado' muestra texto Reprobado", () => {
    render(<EstadoBadge tipo="reprobado" />);
    expect(screen.getByText("Reprobado")).toBeInTheDocument();
  });
});
