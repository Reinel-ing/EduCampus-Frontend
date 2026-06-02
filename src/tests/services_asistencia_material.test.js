import { obtenerReporteAsistenciaGeneral, obtenerAsistenciaPorCurso, obtenerAsistenciaPorEstudiante } from "../services/asistenciaService";
import { subirMaterial, obtenerMaterialPorCurso, obtenerMaterialPorDocente, eliminarMaterial } from "../services/materialService";

describe("asistenciaService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-ASIS01 | obtenerReporteAsistenciaGeneral retorna datos", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });
    const result = await obtenerReporteAsistenciaGeneral();
    expect(Array.isArray(result)).toBe(true);
  });

  test("UT-ASIS02 | obtenerReporteAsistenciaGeneral retorna error si falla", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await obtenerReporteAsistenciaGeneral();
    expect(result.error).toBe(true);
  });

  test("UT-ASIS03 | obtenerAsistenciaPorCurso llama al endpoint correcto", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await obtenerAsistenciaPorCurso(5);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("curso/5"));
  });

  test("UT-ASIS04 | obtenerAsistenciaPorEstudiante llama al endpoint correcto", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await obtenerAsistenciaPorEstudiante(3);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("por-estudiante/3"));
  });

  test("UT-ASIS05 | obtenerAsistenciaPorCurso retorna error en fallo de red", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    const result = await obtenerAsistenciaPorCurso(1);
    expect(result.error).toBe(true);
  });
});

describe("materialService — pruebas unitarias", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  test("UT-MAT01 | subirMaterial usa método POST", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    const formData = new FormData();
    await subirMaterial(formData);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/material/upload"), expect.objectContaining({ method: "POST" }));
  });

  test("UT-MAT02 | obtenerMaterialPorCurso retorna lista", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1, nombre: "Apuntes.pdf" }] });
    const result = await obtenerMaterialPorCurso(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].nombre).toBe("Apuntes.pdf");
  });

  test("UT-MAT03 | obtenerMaterialPorDocente retorna lista", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });
    const result = await obtenerMaterialPorDocente(2);
    expect(Array.isArray(result)).toBe(true);
  });

  test("UT-MAT04 | eliminarMaterial usa método DELETE", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await eliminarMaterial(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/material/1"), expect.objectContaining({ method: "DELETE" }));
  });

  test("UT-MAT05 | subirMaterial retorna error si falla la API", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const result = await subirMaterial(new FormData());
    expect(result.error).toBe(true);
  });
});
