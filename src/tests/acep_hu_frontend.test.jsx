/**
 * acep_hu_frontend.test.jsx
 * Pruebas de aceptacion — Historias de Usuario (Frontend).
 * Verifica criterios de aceptacion desde la perspectiva del usuario final.
 * Tecnica: Camino Basico (CB) orientado a historias de usuario.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import Sidebar from "../components/shared/Sidebar";

const mockIniciarSesion = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: mockIniciarSesion,
    cerrarSesion:  vi.fn(),
    usuario: { id: 1, nombres: "Usuario Test", rol: "admin" },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("../services/notificacionesService", () => ({
  contarNoLeidas: vi.fn().mockResolvedValue(0),
}));

beforeEach(() => { mockIniciarSesion.mockReset(); });

// === HU-01 | Como usuario quiero ver el formulario de login al abrir la aplicacion ===
describe("HU-01 | El usuario ve el formulario de login al abrir la app", () => {

  test("HU-01/P1 | se muestra el nombre del sistema EduCampus como encabezado", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText("EduCampus")).toBeInTheDocument();
  });

  test("HU-01/P2 | se muestran los campos de correo y contrasena", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test("HU-01/P3 | se muestran los tres roles disponibles para seleccionar", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText(/👑 Administrador/)).toBeInTheDocument();
    expect(screen.getByText(/📚 Docente/)).toBeInTheDocument();
    expect(screen.getByText(/🎒 Estudiante/)).toBeInTheDocument();
  });
});

// === HU-02 | Como docente quiero ver mi menu personalizado al ingresar al sistema ===
describe("HU-02 | El docente accede a su menu al ingresar", () => {

  test("HU-02/P1 | sidebar docente muestra Mis Cursos para gestionar sus cursos", () => {
    render(<MemoryRouter><Sidebar userType="docente" /></MemoryRouter>);
    expect(screen.getByText("Mis Cursos")).toBeInTheDocument();
  });

  test("HU-02/P2 | sidebar docente muestra Calificaciones para registrar notas", () => {
    render(<MemoryRouter><Sidebar userType="docente" /></MemoryRouter>);
    expect(screen.getByText("Calificaciones")).toBeInTheDocument();
  });

  test("HU-02/P3 | sidebar docente muestra Estudiantes para ver sus inscritos", () => {
    render(<MemoryRouter><Sidebar userType="docente" /></MemoryRouter>);
    expect(screen.getByText("Estudiantes")).toBeInTheDocument();
  });
});

// === HU-03 | Como estudiante quiero ver mi menu personalizado al ingresar al sistema ===
describe("HU-03 | El estudiante accede a su menu al ingresar", () => {

  test("HU-03/P1 | sidebar estudiante muestra Mis Cursos para ver sus inscripciones", () => {
    render(<MemoryRouter><Sidebar userType="estudiante" /></MemoryRouter>);
    expect(screen.getByText("Mis Cursos")).toBeInTheDocument();
  });

  test("HU-03/P2 | sidebar estudiante muestra Horario para consultar sus clases", () => {
    render(<MemoryRouter><Sidebar userType="estudiante" /></MemoryRouter>);
    expect(screen.getByText("Horario")).toBeInTheDocument();
  });

  test("HU-03/P3 | sidebar admin NO muestra Horario (opcion exclusiva del estudiante)", () => {
    render(<MemoryRouter><Sidebar userType="admin" /></MemoryRouter>);
    expect(screen.queryByText("Horario")).not.toBeInTheDocument();
  });
});

// === HU-04 | Como usuario quiero recibir mensajes claros cuando ingreso datos incorrectos ===
describe("HU-04 | El usuario recibe mensajes de error comprensibles", () => {

  test("HU-04/P1 | intentar ingresar sin datos → aparece mensaje de campos obligatorios", async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => {
      expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
    });
  });

  test("HU-04/P2 | correo con dominio no permitido → mensaje de formato de correo", async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
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

  test("HU-04/P3 | boton Limpiar permite al usuario reiniciar el formulario facilmente", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const inputCorreo = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(inputCorreo, { target: { value: "test@gmail.com" } });
    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));
    expect(inputCorreo.value).toBe("");
  });
});
