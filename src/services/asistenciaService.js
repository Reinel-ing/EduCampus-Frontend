const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Obtener reporte de asistencia general
export const obtenerReporteAsistenciaGeneral = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencia/reporte-general`);
    if (!response.ok)
      throw new Error("No se pudo obtener el reporte de asistencia");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener asistencia por curso
export const obtenerAsistenciaPorCurso = async (cursoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencia/curso/${cursoId}`);
    if (!response.ok)
      throw new Error("No se pudo obtener la asistencia del curso");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener asistencia por estudiante
export const obtenerAsistenciaPorEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/asistencia/por-estudiante/${estudianteId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener la asistencia del estudiante");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Registrar asistencia
export const registrarAsistencia = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencia/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error("No se pudo registrar la asistencia");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Editar asistencia
export const editarAsistencia = async (asistenciaId, datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencia/${asistenciaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error("No se pudo actualizar la asistencia");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener porcentaje de asistencia
export const obtenerPorcentajeAsistencia = async (estudianteId, cursoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/asistencia/porcentaje-estudiante/${estudianteId}/${cursoId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el porcentaje de asistencia");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener reporte de asistencia general
export const obtenerReporteAsistenciaGeneral2 = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reportes/asistencia-general`);
    if (!response.ok)
      throw new Error("No se pudo obtener el reporte de asistencia general");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener reporte de rendimiento académico
export const obtenerReporteRendimientoAcademico = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reportes/rendimiento-academico`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el reporte de rendimiento académico");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener reporte de usuarios activos
export const obtenerReporteUsuariosActivos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reportes/usuarios-activos`);
    if (!response.ok)
      throw new Error("No se pudo obtener el reporte de usuarios activos");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener todos los reportes en una sola llamada
export const obtenerReporteCompleto = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reportes/completo`);
    if (!response.ok) throw new Error("No se pudo obtener el reporte completo");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// DEPRECATED - Mantener por compatibilidad
export const obtenerEstadisticasAsistencia = obtenerReporteAsistenciaGeneral2;
export const obtenerRendimientoAcademico = obtenerReporteRendimientoAcademico;
export const obtenerUsuariosActivos = obtenerReporteUsuariosActivos;
