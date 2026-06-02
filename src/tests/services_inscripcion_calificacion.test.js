import { inscribirEstudiante, listarInscripciones, eliminarInscripcion } from "../services/inscripcionService";
import { crearCalificacion, actualizarCalificacion, obtenerCalificacionesPorCurso } from "../services/calificacionService";

describe("inscripcionService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-IS01 | inscribirEstudiante usa método POST", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    await inscribirEstudiante(1, 2);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/inscripciones/"), expect.objectContaining({ method: "POST" }));
  });

  test("UT-IS02 | inscribirEstudiante envía id_estudiante e id_curso", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    await inscribirEstudiante(5, 10);
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.id_estudiante).toBe(5);
    expect(body.id_curso).toBe(10);
  });

  test("UT-IS03 | inscribirEstudiante retorna error si falla la API", async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ detail: "Cupo lleno" }) });
    const result = await inscribirEstudiante(1, 2);
    expect(result.error).toBe(true);
    expect(result.message).toBeDefined();
  });

  test("UT-IS04 | inscribirEstudiante retorna error en fallo de red", async () => {
    global.fetch.mockRejectedValue(new Error("Connection refused"));
    const result = await inscribirEstudiante(1, 2);
    expect(result.error).toBe(true);
  });

  test("UT-IS05 | listarInscripciones retorna lista", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1, id_estudiante: 1, id_curso: 2 }] });
    const result = await listarInscripciones();
    expect(Array.isArray(result)).toBe(true);
  });

  test("UT-IS06 | eliminarInscripcion usa método DELETE", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await eliminarInscripcion(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/inscripciones/1"), expect.objectContaining({ method: "DELETE" }));
  });
});

describe("calificacionService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-CAL01 | crearCalificacion usa método POST", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    await crearCalificacion({ id_estudiante: 1, id_curso: 2, nota: 4.5 });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/calificaciones/"), expect.objectContaining({ method: "POST" }));
  });

  test("UT-CAL02 | actualizarCalificacion usa método PUT", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    await actualizarCalificacion(1, { nota: 4.0 });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/calificaciones/1"), expect.objectContaining({ method: "PUT" }));
  });

  test("UT-CAL03 | obtenerCalificacionesPorCurso retorna lista", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1, nota: 4.5 }] });
    const result = await obtenerCalificacionesPorCurso(1);
    expect(Array.isArray(result)).toBe(true);
  });

  test("UT-CAL04 | crearCalificacion retorna error si falla la API", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await crearCalificacion({ nota: 3.5 });
    expect(result.error).toBe(true);
  });

  test("UT-CAL05 | actualizarCalificacion retorna error en fallo de red", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    const result = await actualizarCalificacion(1, { nota: 4.0 });
    expect(result.error).toBe(true);
  });
});
