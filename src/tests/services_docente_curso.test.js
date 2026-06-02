import { crearDocente, listarDocentes, obtenerDocentePorId, actualizarDocente, eliminarDocente } from "../services/docenteService";
import { crearCurso, listarCursos, obtenerCursoPorId, actualizarCurso, eliminarCurso } from "../services/cursoService";

const mockDocente = { id_docente: 1, nombres: "Maria", apellidos: "Lopez", cedula: "9876543", correo: "maria@gmail.com", especialidad: "Matematicas", estado: true };
const mockCurso = { id_curso: 1, nombre: "Calculo", cupo_estudiante: 30, id_docente: 1, estado: true };

describe("docenteService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-DS01 | listarDocentes retorna lista al tener éxito", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [mockDocente] });
    const result = await listarDocentes();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].nombres).toBe("Maria");
  });

  test("UT-DS02 | listarDocentes retorna error si falla la API", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await listarDocentes();
    expect(result.error).toBe(true);
  });

  test("UT-DS03 | listarDocentes retorna error en fallo de red", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    const result = await listarDocentes();
    expect(result.error).toBe(true);
  });

  test("UT-DS04 | obtenerDocentePorId retorna docente correcto", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockDocente });
    const result = await obtenerDocentePorId(1);
    expect(result.especialidad).toBe("Matematicas");
  });

  test("UT-DS05 | crearDocente usa método POST", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockDocente });
    await crearDocente({ ...mockDocente, contraseña: "clave123" });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/docentes/"), expect.objectContaining({ method: "POST" }));
  });

  test("UT-DS06 | crearDocente no envía contraseña en texto plano", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockDocente });
    await crearDocente({ ...mockDocente, contraseña: "MiClave123" });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.contraseña).not.toBe("MiClave123");
  });

  test("UT-DS07 | actualizarDocente usa método PUT", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockDocente });
    await actualizarDocente(1, { especialidad: "Fisica" });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/docentes/1"), expect.objectContaining({ method: "PUT" }));
  });

  test("UT-DS08 | eliminarDocente usa método DELETE", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await eliminarDocente(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/docentes/1"), expect.objectContaining({ method: "DELETE" }));
  });
});

describe("cursoService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-CS01 | listarCursos retorna lista al tener éxito", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [mockCurso] });
    const result = await listarCursos();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].nombre).toBe("Calculo");
  });

  test("UT-CS02 | listarCursos retorna error si falla la API", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await listarCursos();
    expect(result.error).toBe(true);
  });

  test("UT-CS03 | obtenerCursoPorId retorna curso correcto", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockCurso });
    const result = await obtenerCursoPorId(1);
    expect(result.nombre).toBe("Calculo");
  });

  test("UT-CS04 | crearCurso usa método POST", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockCurso });
    await crearCurso(mockCurso);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/cursos/"), expect.objectContaining({ method: "POST" }));
  });

  test("UT-CS05 | actualizarCurso usa método PUT", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockCurso });
    await actualizarCurso(1, { nombre: "Calculo II" });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/cursos/1"), expect.objectContaining({ method: "PUT" }));
  });

  test("UT-CS06 | eliminarCurso usa método DELETE", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await eliminarCurso(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/cursos/1"), expect.objectContaining({ method: "DELETE" }));
  });

  test("UT-CS07 | listarCursos retorna error en fallo de red", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    const result = await listarCursos();
    expect(result.error).toBe(true);
  });
});
