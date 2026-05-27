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

// =============================================================================
// CLASES DE EQUIVALENCIA — renderizado
// =============================================================================
describe("CE — renderizado del formulario", () => {
  test("CE-01 | muestra el titulo EduCampus", () => {
    renderLogin();
    expect(screen.getByText("EduCampus")).toBeInTheDocument();
  });

  test("CE-02 | muestra el campo de correo", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  test("CE-03 | muestra el campo de contraseña", () => {
    renderLogin();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test("CE-04 | muestra los tres roles disponibles", () => {
    renderLogin();
    expect(screen.getByText(/👑 Administrador/)).toBeInTheDocument();
    expect(screen.getByText(/📚 Docente/)).toBeInTheDocument();
    expect(screen.getByText(/🎒 Estudiante/)).toBeInTheDocument();
  });

  test("CE-05 | muestra los botones Limpiar e Ingresar", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /limpiar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — validacion del formulario
// =============================================================================
describe("CE — validaciones al enviar el formulario", () => {
  test("CE-06 | campos vacios → muestra error de campos obligatorios", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
    });
  });

  test("CE-07 | correo con dominio no permitido → muestra error de formato", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "usuario@yahoo.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(screen.getByText(/solo se permiten correos/i)).toBeInTheDocument();
    });
  });

  test("CE-08 | boton Limpiar resetea el campo de correo", async () => {
    renderLogin();
    const inputCorreo = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(inputCorreo, { target: { value: "test@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(inputCorreo.value).toBe("");
  });
});
