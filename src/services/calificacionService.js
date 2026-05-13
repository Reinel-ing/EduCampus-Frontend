const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const crearCalificacion = async (calificacion) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calificaciones/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calificacion),
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de calificaciones");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const actualizarCalificacion = async (calificacionId, datos) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/calificaciones/${calificacionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      }
    );
    if (!response.ok) throw new Error("No se pudo actualizar la calificación");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerCalificacionesPorCurso = async (cursoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/calificaciones/por-curso/${cursoId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener las calificaciones del curso");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerCalificacionesPorEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/calificaciones/por-estudiante/${estudianteId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener las calificaciones del estudiante");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerPromedioEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/calificaciones/promedio-estudiante/${estudianteId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el promedio del estudiante");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerPromedioCurso = async (cursoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/calificaciones/promedio-curso/${cursoId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el promedio del curso");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};
