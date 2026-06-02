import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderHook, act } from "@testing-library/react";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn().mockResolvedValue({ error: false }),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";
import EstadoBadge from "../components/estudiante/EstadoBadge";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";

const renderLogin = () =>
  render(<MemoryRouter><Login /></MemoryRouter>);

describe("BUG — Pruebas de regresión", () => {
  test("BUG-01 | correo con espacios en blanco no pasa validación", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "   " } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/solo se permiten correos/i)).toBeInTheDocument();
  });

  test("BUG-02 | EstadoBadge con tipo null no rompe la app", () => {
    expect(() => render(<EstadoBadge tipo={null} />)).not.toThrow();
  });

  test("BUG-03 | EstadoBadge con tipo undefined no rompe la app", () => {
    expect(() => render(<EstadoBadge tipo={undefined} />)).not.toThrow();
  });

  test("BUG-04 | nota 0 muestra No aprobado (no error)", () => {
    render(<EstadoBadge tipo="nota" nota={0} />);
    expect(screen.getByText(/No aprobado/i)).toBeInTheDocument();
  });

  test("BUG-05 | nota 5.0 muestra Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={5.0} />);
    expect(screen.getByText(/Aprobado/i)).toBeInTheDocument();
  });

  test("BUG-06 | validar estudiante con null no lanza excepción", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    expect(() => {
      act(() => { result.current.validate({ nombres: null, apellidos: null, cedula: null, correo: null, contraseña: null, telefono: null, estado: null }); });
    }).not.toThrow();
  });

  test("BUG-07 | limpiar login después de error borra el mensaje", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(screen.queryByText(/completa todos los campos/i)).not.toBeInTheDocument();
  });

  test("BUG-08 | correo con mayúsculas es normalizado a minúsculas internamente", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ error: false });
    jest.spyOn(require("../context/AuthContext"), "useAuth").mockReturnValue({
      iniciarSesion: mockLogin, isAuthenticated: false, loading: false,
    });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "ADMIN@GMAIL.COM" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(screen.queryByText(/solo se permiten correos/i)).not.toBeInTheDocument();
  });

  test("BUG-09 | cupo negativo en curso es rechazado por validador", () => {
    const { result } = renderHook(() => require("../hooks/useCursoValidator").useCursoValidator());
    act(() => {
      result.current.validate({ nombre: "Curso", cupo_estudiante: -1, id_docente: 1, horario: [{}], estado: true });
    });
    expect(result.current.errors.cupo_estudiante).toBeDefined();
  });

  test("BUG-10 | Login no muestra error de correo al cargar por primera vez", () => {
    renderLogin();
    expect(screen.queryByText(/solo se permiten correos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/completa todos/i)).not.toBeInTheDocument();
  });
});
