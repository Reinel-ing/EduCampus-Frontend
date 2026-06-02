/**
 * Pruebas de integración — Servicios API
 * Verifica que los servicios se integren correctamente con fetch
 * y que el flujo de datos entre capas funcione bien.
 */

import { iniciarSesion, cerrarSesion, estaAutenticado, obtenerRolUsuario } from "../services/authService";
import { listarEstudiantes, crearEstudiante } from "../services/estudianteService";

describe("INT — Servicios API (integración con fetch mock)", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("INT-SV01 | flujo completo login → sesión activa → obtener rol", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, correo: "admin@gmail.com", rol: "admin" }),
    });
    await iniciarSesion("admin@gmail.com", "clave123");
    expect(estaAutenticado()).toBe(true);
    expect(obtenerRolUsuario()).toBe("admin");
  });

  test("INT-SV02 | flujo login → cerrar sesión → sesión eliminada", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, rol: "admin" }),
    });
    await iniciarSesion("admin@gmail.com", "clave123");
    expect(estaAutenticado()).toBe(true);
    cerrarSesion();
    expect(estaAutenticado()).toBe(false);
    expect(obtenerRolUsuario()).toBeNull();
  });

  test("INT-SV03 | login fallido no guarda sesión", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 401 });
    await iniciarSesion("admin@gmail.com", "malaClave");
    expect(estaAutenticado()).toBe(false);
  });

  test("INT-SV04 | listar estudiantes devuelve array correcto", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id_estudiante: 1, nombres: "Ana" },
        { id_estudiante: 2, nombres: "Luis" },
      ],
    });
    const estudiantes = await listarEstudiantes();
    expect(estudiantes).toHaveLength(2);
    expect(estudiantes[0].nombres).toBe("Ana");
  });

  test("INT-SV05 | crear estudiante y listar → el nuevo aparece en la lista", async () => {
    const nuevoEst = { id_estudiante: 99, nombres: "Nuevo", correo: "n@gmail.com" };
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => nuevoEst })
      .mockResolvedValueOnce({ ok: true, json: async () => [nuevoEst] });

    await crearEstudiante({ nombres: "Nuevo", contraseña: "clave123" });
    const lista = await listarEstudiantes();
    expect(lista.some((e) => e.nombres === "Nuevo")).toBe(true);
  });

  test("INT-SV06 | error de red devuelve objeto con error=true", async () => {
    global.fetch.mockRejectedValue(new Error("Failed to fetch"));
    const result = await listarEstudiantes();
    expect(result.error).toBe(true);
    expect(result.message).toBeDefined();
  });

  test("INT-SV07 | fetch es llamado con la URL correcta del endpoint", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await listarEstudiantes();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("estudiantes")
    );
  });

  test("INT-SV08 | fetch es llamado con Content-Type JSON en POST", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id_estudiante: 1 }),
    });
    await crearEstudiante({ nombres: "Test", contraseña: "clave123" });
    const options = global.fetch.mock.calls[0][1];
    expect(options.headers["Content-Type"]).toBe("application/json");
  });

  test("INT-SV09 | múltiples servicios pueden coexistir sin interferir", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1 }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 2 }] });

    const result1 = await listarEstudiantes();
    const result2 = await listarEstudiantes();
    expect(result1[0].id).toBe(1);
    expect(result2[0].id).toBe(2);
  });

  test("INT-SV10 | login con error de servidor devuelve mensaje de error", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    const result = await iniciarSesion("admin@gmail.com", "clave");
    expect(result.error).toBe(true);
    expect(typeof result.message).toBe("string");
  });
});
