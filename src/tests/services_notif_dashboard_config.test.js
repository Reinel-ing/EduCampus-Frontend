import { obtenerNotificaciones, contarNoLeidas, marcarLeida, marcarTodasLeidas, eliminarNotificacion } from "../services/notificacionesService";
import { getAdminDashboardStats, getDocenteDashboardStats, getEstudianteDashboardStats } from "../services/dashboardService";
import { crearConfiguracion, obtenerConfiguracion, actualizarConfiguracion } from "../services/configuracionService";

describe("notificacionesService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-NOT01 | obtenerNotificaciones retorna array vacío si falla", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    const result = await obtenerNotificaciones("admin", 1);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test("UT-NOT02 | obtenerNotificaciones retorna lista cuando tiene éxito", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1, titulo: "Test" }] });
    const result = await obtenerNotificaciones("admin", 1);
    expect(result.length).toBe(1);
  });

  test("UT-NOT03 | contarNoLeidas retorna 0 si falla", async () => {
    global.fetch.mockRejectedValue(new Error("error"));
    const result = await contarNoLeidas("admin", 1);
    expect(result).toBe(0);
  });

  test("UT-NOT04 | contarNoLeidas retorna número de no leídas", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ no_leidas: 3 }) });
    const result = await contarNoLeidas("admin", 1);
    expect(result).toBe(3);
  });

  test("UT-NOT05 | marcarLeida usa método PUT", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    await marcarLeida(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/leer"), expect.objectContaining({ method: "PUT" }));
  });

  test("UT-NOT06 | eliminarNotificacion usa método DELETE", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await eliminarNotificacion(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/notificaciones/1"), expect.objectContaining({ method: "DELETE" }));
  });
});

describe("dashboardService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-DB01 | getAdminDashboardStats retorna datos del dashboard", async () => {
    const mockStats = { total_estudiantes: 50, total_docentes: 10 };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockStats });
    const result = await getAdminDashboardStats();
    expect(result.total_estudiantes).toBe(50);
  });

  test("UT-DB02 | getAdminDashboardStats lanza error si falla", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(getAdminDashboardStats()).rejects.toThrow();
  });

  test("UT-DB03 | getDocenteDashboardStats llama al endpoint correcto", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await getDocenteDashboardStats(5);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/docente/5"), expect.any(Object));
  });

  test("UT-DB04 | getEstudianteDashboardStats llama al endpoint correcto", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await getEstudianteDashboardStats(3);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/estudiante/3"), expect.any(Object));
  });
});

describe("configuracionService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-CFG01 | obtenerConfiguracion retorna datos", async () => {
    const mockConfig = { nombre_institucion: "EduCampus" };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockConfig });
    const result = await obtenerConfiguracion();
    expect(result.nombre_institucion).toBe("EduCampus");
  });

  test("UT-CFG02 | crearConfiguracion usa método POST", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    await crearConfiguracion({ nombre_institucion: "EduCampus" });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/configuracion/"), expect.objectContaining({ method: "POST" }));
  });

  test("UT-CFG03 | actualizarConfiguracion usa método PUT", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await actualizarConfiguracion({ nombre_institucion: "Nueva" });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/configuracion/"), expect.objectContaining({ method: "PUT" }));
  });

  test("UT-CFG04 | obtenerConfiguracion retorna error si falla", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await obtenerConfiguracion();
    expect(result.error).toBe(true);
  });
});
