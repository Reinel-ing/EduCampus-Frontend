const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * Inscribir un estudiante en un curso
 * @param {number} idEstudiante - ID del estudiante
 * @param {number} idCurso - ID del curso
 * @returns {Promise<Object>} Inscripción creada
 */
export const inscribirEstudiante = async (idEstudiante, idCurso) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inscripciones/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_estudiante: idEstudiante,
        id_curso: idCurso,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: true,
        message: error.detail || "Error al inscribir estudiante",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en inscribirEstudiante:", error);
    return {
      error: true,
      message: "Error de conexión al inscribir estudiante",
    };
  }
};

/**
 * Listar todas las inscripciones
 * @returns {Promise<Array>} Lista de inscripciones
 */
export const listarInscripciones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/inscripciones/`);

    if (!response.ok) {
      return { error: true, message: "Error al listar inscripciones" };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en listarInscripciones:", error);
    return { error: true, message: "Error de conexión" };
  }
};

/**
 * Obtener IDs de estudiantes inscritos en un curso
 * @param {number} idCurso - ID del curso
 * @returns {Promise<Array<number>>} Array de IDs de estudiantes
 */
export const obtenerEstudiantesPorCurso = async (idCurso) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inscripciones/por-curso/${idCurso}`
    );

    if (!response.ok) {
      return { error: true, message: "Error al obtener estudiantes del curso" };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerEstudiantesPorCurso:", error);
    return { error: true, message: "Error de conexión" };
  }
};

/**
 * Obtener información completa de estudiantes inscritos en un curso
 * @param {number} idCurso - ID del curso
 * @returns {Promise<Array>} Array de estudiantes con detalles
 */
export const obtenerEstudiantesConDetallesPorCurso = async (idCurso) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inscripciones/detalles/por-curso/${idCurso}`
    );

    if (!response.ok) {
      return {
        error: true,
        message: "Error al obtener detalles de estudiantes",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerEstudiantesConDetallesPorCurso:", error);
    return { error: true, message: "Error de conexión" };
  }
};

/**
 * Obtener IDs de cursos en los que está inscrito un estudiante
 * @param {number} idEstudiante - ID del estudiante
 * @returns {Promise<Array<number>>} Array de IDs de cursos
 */
export const obtenerCursosPorEstudiante = async (idEstudiante) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inscripciones/por-estudiante/${idEstudiante}`
    );

    if (!response.ok) {
      return { error: true, message: "Error al obtener cursos del estudiante" };
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerCursosPorEstudiante:", error);
    return { error: true, message: "Error de conexión" };
  }
};

/**
 * Eliminar una inscripción (remover estudiante de curso)
 * @param {number} idInscripcion - ID de la inscripción
 * @returns {Promise<Object>} Resultado de la operación
 */
export const eliminarInscripcion = async (idInscripcion) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inscripciones/${idInscripcion}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      return { error: true, message: "Error al eliminar inscripción" };
    }

    return { success: true, message: "Inscripción eliminada exitosamente" };
  } catch (error) {
    console.error("Error en eliminarInscripcion:", error);
    return {
      error: true,
      message: "Error de conexión al eliminar inscripción",
    };
  }
};

/**
 * Verificar si un estudiante está inscrito en un curso
 * @param {number} idEstudiante - ID del estudiante
 * @param {number} idCurso - ID del curso
 * @returns {Promise<boolean>} true si está inscrito, false si no
 */
export const verificarInscripcion = async (idEstudiante, idCurso) => {
  try {
    const cursos = await obtenerCursosPorEstudiante(idEstudiante);

    if (cursos.error) {
      return false;
    }

    return Array.isArray(cursos) && cursos.includes(idCurso);
  } catch (error) {
    console.error("Error en verificarInscripcion:", error);
    return false;
  }
};
