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
import EstadoBadge from "../components/estudiante/EstadoBadge";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";
import { useDocenteValidator } from "../hooks/useDocenteValidator";
import { useCursoValidator } from "../hooks/useCursoValidator";
import { renderHook, act } from "@testing-library/react";

const renderLogin = () =>
  render(<MemoryRouter><Login /></MemoryRouter>);

describe("ACEP — Pruebas de Aceptación (Historias de Usuario)", () => {
  beforeEach(() => { mockIniciarSesion.mockReset(); });

  // HU-01: Iniciar sesión
  test("HU-01/P1 | administrador intenta ingresar sin datos → error de campos", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
  });

  test("HU-01/P2 | correo con dominio no permitido → error de dominio", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "user@yahoo.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/solo se permiten correos/i)).toBeInTheDocument();
  });

  test("HU-01/P3 | credenciales correctas invocan el servicio de login", async () => {
    mockIniciarSesion.mockResolvedValue({ error: false });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: "admin@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => expect(mockIniciarSesion).toHaveBeenCalled());
  });

  // HU-02: Gestión de estudiantes
  test("HU-02/P1 | crear estudiante con datos válidos pasa validación", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => {
      const ok = result.current.validate({
        nombres: "Juan", apellidos: "Garcia", cedula: "1234567",
        correo: "juan@gmail.com", contraseña: "clave123",
        telefono: "3001234567", estado: true,
      });
      expect(ok).toBe(true);
    });
  });

  test("HU-02/P2 | crear estudiante sin nombre falla validación", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => {
      result.current.validate({
        nombres: "", apellidos: "Garcia", cedula: "1234567",
        correo: "juan@gmail.com", contraseña: "clave123",
        telefono: "3001234567", estado: true,
      });
    });
    expect(result.current.errors.nombres).toBeDefined();
  });

  // HU-03: Gestión de docentes
  test("HU-03/P1 | crear docente con especialidad válida pasa validación", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => {
      const ok = result.current.validate({
        nombres: "Ana", apellidos: "Ruiz", cedula: "9876543",
        correo: "ana@gmail.com", contraseña: "clave123",
        especialidad: "Fisica", estado: true,
      });
      expect(ok).toBe(true);
    });
  });

  test("HU-03/P2 | crear docente sin especialidad falla validación", () => {
    const { result } = renderHook(() => useDocenteValidator());
    act(() => {
      result.current.validate({
        nombres: "Ana", apellidos: "Ruiz", cedula: "9876543",
        correo: "ana@gmail.com", contraseña: "clave123",
        especialidad: "", estado: true,
      });
    });
    expect(result.current.errors.especialidad).toBeDefined();
  });

  // HU-04: Gestión de cursos
  test("HU-04/P1 | crear curso con todos los datos válidos pasa validación", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => {
      const ok = result.current.validate({
        nombre: "Calculo Integral", cupo_estudiante: 25,
        id_docente: 1, horario: [{ dia: "Martes", hora: "10:00" }], estado: true,
      });
      expect(ok).toBe(true);
    });
  });

  test("HU-04/P2 | crear curso sin docente asignado falla validación", () => {
    const { result } = renderHook(() => useCursoValidator());
    act(() => {
      result.current.validate({
        nombre: "Calculo", cupo_estudiante: 20,
        id_docente: null, horario: [{ dia: "Lunes", hora: "08:00" }], estado: true,
      });
    });
    expect(result.current.errors.id_docente).toBeDefined();
  });

  // HU-05: Calificaciones
  test("HU-05/P1 | nota >= 3.0 muestra estado Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={4.5} />);
    expect(screen.getByText(/Aprobado/i)).toBeInTheDocument();
  });

  test("HU-05/P2 | nota < 3.0 muestra estado No aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={1.5} />);
    expect(screen.getByText(/No aprobado/i)).toBeInTheDocument();
  });

  // HU-06: Asistencia
  test("HU-06/P1 | badge presente muestra estado correcto", () => {
    render(<EstadoBadge tipo="presente" />);
    expect(screen.getByText("Presente")).toBeInTheDocument();
  });

  test("HU-06/P2 | badge ausente muestra estado correcto", () => {
    render(<EstadoBadge tipo="ausente" />);
    expect(screen.getByText("Ausente")).toBeInTheDocument();
  });
});
