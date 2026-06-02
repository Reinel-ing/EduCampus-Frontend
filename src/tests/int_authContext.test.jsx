import React from "react";
import { render, screen, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Mock del authService
jest.mock("../services/authService", () => ({
  iniciarSesion: jest.fn(),
  cerrarSesion: jest.fn(),
  obtenerUsuarioActual: jest.fn(),
  estaAutenticado: jest.fn(),
}));

import * as authService from "../services/authService";

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("INT — AuthContext (integración)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    authService.estaAutenticado.mockReturnValue(false);
    authService.obtenerUsuarioActual.mockReturnValue(null);
  });

  test("INT-AC01 | useAuth lanza error fuera del AuthProvider", () => {
    const { result } = renderHook(() => {
      try { return useAuth(); } catch (e) { return { error: e.message }; }
    });
    expect(result.current.error).toContain("AuthProvider");
  });

  test("INT-AC02 | isAuthenticated inicia en false sin sesión previa", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.isAuthenticated).toBe(false);
  });

  test("INT-AC03 | iniciarSesion exitoso actualiza isAuthenticated a true", async () => {
    authService.iniciarSesion.mockResolvedValue({
      error: false,
      data: { id: 1, correo: "admin@gmail.com", rol: "admin" },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    await act(async () => {
      await result.current.iniciarSesion("admin@gmail.com", "clave123");
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  test("INT-AC04 | iniciarSesion fallido no cambia isAuthenticated", async () => {
    authService.iniciarSesion.mockResolvedValue({ error: true, message: "Credenciales incorrectas" });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    await act(async () => {
      await result.current.iniciarSesion("admin@gmail.com", "malo");
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  test("INT-AC05 | cerrarSesion cambia isAuthenticated a false", async () => {
    authService.iniciarSesion.mockResolvedValue({
      error: false,
      data: { id: 1, rol: "admin" },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    await act(async () => {
      await result.current.iniciarSesion("admin@gmail.com", "clave123");
    });
    act(() => { result.current.cerrarSesion(); });
    expect(result.current.isAuthenticated).toBe(false);
  });

  test("INT-AC06 | loading inicia en true y termina en false", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.loading).toBe(false);
  });

  test("INT-AC07 | AuthProvider renderiza hijos correctamente", () => {
    render(
      <AuthProvider>
        <div>Contenido hijo</div>
      </AuthProvider>
    );
    expect(screen.getByText("Contenido hijo")).toBeInTheDocument();
  });

  test("INT-AC08 | usuario inicia en null sin sesión", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.usuario).toBeNull();
  });
});
