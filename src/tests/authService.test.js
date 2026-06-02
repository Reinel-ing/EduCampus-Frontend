import {
  cerrarSesion,
  obtenerUsuarioActual,
  estaAutenticado,
  obtenerRolUsuario,
} from "../services/authService";

describe("authService — pruebas unitarias", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  // ── cerrarSesion ──────────────────────────────────────────────────────────

  test("UT-AS01 | cerrarSesion limpia el localStorage", () => {
    localStorage.setItem("usuario", JSON.stringify({ id: 1 }));
    localStorage.setItem("isAuthenticated", "true");
    cerrarSesion();
    expect(localStorage.getItem("usuario")).toBeNull();
    expect(localStorage.getItem("isAuthenticated")).toBeNull();
  });

  // ── obtenerUsuarioActual ──────────────────────────────────────────────────

  test("UT-AS02 | obtenerUsuarioActual retorna null sin sesión", () => {
    expect(obtenerUsuarioActual()).toBeNull();
  });

  test("UT-AS03 | obtenerUsuarioActual retorna el usuario guardado", () => {
    const usuario = { id: 1, correo: "admin@gmail.com", rol: "admin" };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    expect(obtenerUsuarioActual()).toEqual(usuario);
  });

  // ── estaAutenticado ───────────────────────────────────────────────────────

  test("UT-AS04 | estaAutenticado retorna false sin sesión", () => {
    expect(estaAutenticado()).toBe(false);
  });

  test("UT-AS05 | estaAutenticado retorna true con sesión activa", () => {
    localStorage.setItem("isAuthenticated", "true");
    expect(estaAutenticado()).toBe(true);
  });

  test("UT-AS06 | estaAutenticado retorna false con valor incorrecto", () => {
    localStorage.setItem("isAuthenticated", "false");
    expect(estaAutenticado()).toBe(false);
  });

  // ── obtenerRolUsuario ─────────────────────────────────────────────────────

  test("UT-AS07 | obtenerRolUsuario retorna null sin sesión", () => {
    expect(obtenerRolUsuario()).toBeNull();
  });

  test("UT-AS08 | obtenerRolUsuario retorna el rol del usuario", () => {
    localStorage.setItem("usuario", JSON.stringify({ rol: "admin" }));
    expect(obtenerRolUsuario()).toBe("admin");
  });

  test("UT-AS09 | obtenerRolUsuario retorna docente correctamente", () => {
    localStorage.setItem("usuario", JSON.stringify({ rol: "docente" }));
    expect(obtenerRolUsuario()).toBe("docente");
  });

  test("UT-AS10 | obtenerRolUsuario retorna estudiante correctamente", () => {
    localStorage.setItem("usuario", JSON.stringify({ rol: "estudiante" }));
    expect(obtenerRolUsuario()).toBe("estudiante");
  });

  // ── iniciarSesion (con fetch mock) ────────────────────────────────────────

  test("UT-AS11 | iniciarSesion guarda usuario en localStorage al tener éxito", async () => {
    const { iniciarSesion } = await import("../services/authService");
    const mockUser = { id: 1, correo: "admin@gmail.com", rol: "admin" };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });
    await iniciarSesion("admin@gmail.com", "clave123");
    expect(localStorage.getItem("isAuthenticated")).toBe("true");
    expect(JSON.parse(localStorage.getItem("usuario"))).toEqual(mockUser);
  });

  test("UT-AS12 | iniciarSesion retorna error con credenciales incorrectas", async () => {
    const { iniciarSesion } = await import("../services/authService");
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });
    const result = await iniciarSesion("admin@gmail.com", "incorrecta");
    expect(result.error).toBe(true);
    expect(result.message).toContain("incorrectas");
  });
});
