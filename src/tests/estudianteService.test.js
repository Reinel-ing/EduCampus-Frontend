import {
  listarEstudiantes,
  crearEstudiante,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  eliminarEstudiante,
} from "../services/estudianteService";

const mockEstudiante = {
  id_estudiante: 1,
  nombres: "Juan",
  apellidos: "Garcia",
  cedula: "1234567",
  correo: "juan@gmail.com",
  telefono: "3001234567",
  estado: true,
};

describe("estudianteService — pruebas unitarias (fetch mock)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("UT-EST01 | listarEstudiantes retorna lista al tener éxito", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [mockEstudiante],
    });
    const result = await listarEstudiantes();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].nombres).toBe("Juan");
  });

  test("UT-EST02 | listarEstudiantes retorna error si falla la API", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await listarEstudiantes();
    expect(result.error).toBe(true);
  });

  test("UT-EST03 | listarEstudiantes retorna error si hay fallo de red", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    const result = await listarEstudiantes();
    expect(result.error).toBe(true);
  });

  test("UT-EST04 | obtenerEstudiantePorId retorna el estudiante correcto", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockEstudiante,
    });
    const result = await obtenerEstudiantePorId(1);
    expect(result.id_estudiante).toBe(1);
    expect(result.nombres).toBe("Juan");
  });

  test("UT-EST05 | crearEstudiante llama a fetch con método POST", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockEstudiante, id_estudiante: 10 }),
    });
    await crearEstudiante({ ...mockEstudiante, contraseña: "clave123" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/estudiantes/"),
      expect.objectContaining({ method: "POST" })
    );
  });

  test("UT-EST06 | actualizarEstudiante llama a fetch con método PUT", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockEstudiante,
    });
    await actualizarEstudiante(1, { nombres: "Juan Actualizado" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/estudiantes/1"),
      expect.objectContaining({ method: "PUT" })
    );
  });

  test("UT-EST07 | eliminarEstudiante llama a fetch con método DELETE", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    await eliminarEstudiante(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/estudiantes/1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("UT-EST08 | crearEstudiante no envía contraseña en texto plano", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockEstudiante,
    });
    await crearEstudiante({ ...mockEstudiante, contraseña: "miClave123" });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.contraseña).not.toBe("miClave123");
    expect(body.contraseña).toHaveLength(64); // SHA-256 hash
  });
});
