const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const crearCurso = async (curso) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(curso),
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de cursos");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const listarCursos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/`);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de cursos");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerCursoPorId = async (cursoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}`);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de cursos");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const actualizarCurso = async (cursoId, datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de cursos");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const eliminarCurso = async (cursoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cursos/${cursoId}`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de cursos");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerEstudiantesCurso = async (cursoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/${cursoId}/estudiantes`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener estudiantes del curso");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const verificarCupo = async (cursoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/${cursoId}/verificar-cupo`
    );
    if (!response.ok) throw new Error("No se pudo verificar el cupo del curso");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerCursosPorDocente = async (docenteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/por-docente/${docenteId}`
    );
    if (!response.ok) throw new Error("No se pudo obtener cursos del docente");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerProximasClases = async (docenteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/proximas-clases/${docenteId}`
    );
    if (!response.ok) throw new Error("No se pudo obtener las próximas clases");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerCursosPorEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/por-estudiante/${estudianteId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener cursos del estudiante");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerHorarioEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cursos/horario/${estudianteId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el horario del estudiante");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};
