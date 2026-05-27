import { hashPassword } from "../utils/crypto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const crearEstudiante = async (estudiante) => {
  try {
    // Hashear la contraseña antes de enviarla
    const payload = { ...estudiante };
    if (payload.contraseña) {
      payload.contraseña = await hashPassword(payload.contraseña);
    }

    const response = await fetch(`${API_BASE_URL}/estudiantes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de estudiantes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const listarEstudiantes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/estudiantes/`);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de estudiantes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerEstudiantePorId = async (estudianteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estudiantes/${estudianteId}`);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de estudiantes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const actualizarEstudiante = async (estudianteId, datos) => {
  try {
    // Si se actualiza la contraseña, hashearla antes de enviar
    const payload = { ...datos };
    if (payload.contraseña) {
      payload.contraseña = await hashPassword(payload.contraseña);
    }

    const response = await fetch(
      `${API_BASE_URL}/estudiantes/${estudianteId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de estudiantes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const eliminarEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/estudiantes/${estudianteId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de estudiantes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerProximasClasesEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/estudiantes/proximas-clases/${estudianteId}`
    );
    if (!response.ok) throw new Error("No se pudo obtener las próximas clases");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerCursosEstudiante = async (estudianteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/estudiantes/${estudianteId}/cursos`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener los cursos del estudiante");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};
