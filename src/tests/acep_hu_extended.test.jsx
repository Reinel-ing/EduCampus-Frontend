/**
 * Pruebas de Aceptación extendidas — Historias de Usuario adicionales
 * Cubre HU-07 a HU-14: Configuración, Notificaciones, Materiales,
 * Reportes, Calificaciones, Asistencia, Cursos, Seguridad de acceso.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderHook, act } from "@testing-library/react";
import EstadoBadge from "../components/estudiante/EstadoBadge";
import StatCard from "../components/administrador/StatCard";
import { useConfiguracionValidator } from "../hooks/useConfiguracionValidator";
import { useEstudianteValidator } from "../hooks/useEstudianteValidator";
import { useDocenteValidator } from "../hooks/useDocenteValidator";
import { useCursoValidator } from "../hooks/useCursoValidator";
import { hashPassword } from "../utils/crypto";
import { cerrarSesion, estaAutenticado } from "../services/authService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn().mockResolvedValue({ error: false }),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

describe("ACEP — Historias de Usuario extendidas", () => {
  beforeEach(() => { localStorage.clear(); });

  // HU-07: Configuración del sistema
  test("HU-07/P1 | admin configura institución con datos válidos", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => {
      const ok = result.current.validate({
        nombre_institucion: "Universidad EduCampus",
        email_contacto: "admin@educampus.edu.co",
        ano_academico: "2025-2026",
      });
      expect(ok).toBe(true);
    });
  });

  test("HU-07/P2 | admin no puede guardar configuración con email inválido", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => {
      result.current.validate({
        nombre_institucion: "Universidad",
        email_contacto: "no-es-email",
        ano_academico: "2025-2026",
      });
    });
    expect(result.current.errors.email_contacto).toBeDefined();
  });

  test("HU-07/P3 | formato año académico YYYY-YYYY es requerido", () => {
    const { result } = renderHook(() => useConfiguracionValidator());
    act(() => {
      result.current.validate({
        nombre_institucion: "Universidad",
        email_contacto: "admin@edu.co",
        ano_academico: "2025",
      });
    });
    expect(result.current.errors.ano_academico).toBeDefined();
  });

  // HU-08: Dashboard estadísticas
  test("HU-08/P1 | StatCard muestra estadísticas del sistema correctamente", () => {
    render(<StatCard title="Total Estudiantes" value={150} icon="👨‍🎓" />);
    expect(screen.getByText("Total Estudiantes")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  test("HU-08/P2 | múltiples StatCards se renderizan sin conflicto", () => {
    render(
      <div>
        <StatCard title="Estudiantes" value={50} icon="👨‍🎓" />
        <StatCard title="Docentes" value={10} icon="👨‍🏫" />
        <StatCard title="Cursos" value={8} icon="📚" />
      </div>
    );
    expect(screen.getByText("Estudiantes")).toBeInTheDocument();
    expect(screen.getByText("Docentes")).toBeInTheDocument();
    expect(screen.getByText("Cursos")).toBeInTheDocument();
  });

  // HU-09: Sistema de calificaciones
  test("HU-09/P1 | nota 5.0 se muestra como Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={5.0} />);
    expect(screen.getByText(/Aprobado/i)).toBeInTheDocument();
  });

  test("HU-09/P2 | nota 1.0 se muestra como No aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={1.0} />);
    expect(screen.getByText(/No aprobado/i)).toBeInTheDocument();
  });

  test("HU-09/P3 | nota exactamente 3.0 es el límite de aprobación", () => {
    render(<EstadoBadge tipo="nota" nota={3.0} />);
    expect(screen.getByText(/Aprobado/i)).toBeInTheDocument();
  });

  test("HU-09/P4 | nota 2.9 está justo bajo el límite", () => {
    render(<EstadoBadge tipo="nota" nota={2.9} />);
    expect(screen.getByText(/No aprobado/i)).toBeInTheDocument();
  });

  // HU-10: Registro de asistencia
  test("HU-10/P1 | badge Presente se muestra correctamente", () => {
    render(<EstadoBadge tipo="presente" />);
    expect(screen.getByText("Presente")).toBeInTheDocument();
  });

  test("HU-10/P2 | badge Ausente se muestra correctamente", () => {
    render(<EstadoBadge tipo="ausente" />);
    expect(screen.getByText("Ausente")).toBeInTheDocument();
  });

  // HU-11: Material didáctico
  test("HU-11/P1 | badge Entregado se muestra para materiales entregados", () => {
    render(<EstadoBadge tipo="entregado" />);
    expect(screen.getByText("Entregado")).toBeInTheDocument();
  });

  test("HU-11/P2 | badge Pendiente se muestra para materiales pendientes", () => {
    render(<EstadoBadge tipo="pendiente" />);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  // HU-12: Seguridad de contraseñas
  test("HU-12/P1 | contraseña nunca viaja en texto plano", async () => {
    const clave = "MiClaveUltraSecreta";
    const hash = await hashPassword(clave);
    expect(hash).not.toContain(clave);
    expect(hash).toHaveLength(64);
  });

  // HU-13: Cierre de sesión
  test("HU-13/P1 | usuario puede cerrar sesión y limpiar credenciales", () => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("usuario", JSON.stringify({ id: 1, rol: "admin" }));
    cerrarSesion();
    expect(estaAutenticado()).toBe(false);
    expect(localStorage.getItem("usuario")).toBeNull();
  });

  // HU-14: Validación en tiempo real
  test("HU-14/P1 | validación detecta todos los errores de estudiante a la vez", () => {
    const { result } = renderHook(() => useEstudianteValidator());
    act(() => {
      result.current.validate({
        nombres: "", apellidos: "", cedula: "", correo: "malo",
        contraseña: "ab", telefono: "123", estado: null,
      });
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThanOrEqual(5);
  });

  test("HU-14/P2 | formulario de login bloquea envío con correo vacío", async () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
  });
});
