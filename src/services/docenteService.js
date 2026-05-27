import { hashPassword } from "../utils/crypto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const crearDocente = async (docente) => {
  try {
    // Hashear la contraseña antes de enviarla
    const payload = { ...docente };
    if (payload.contraseña) {
      payload.contraseña = await hashPassword(payload.contraseña);
    }

    const response = await fetch(`${API_BASE_URL}/docentes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(docente);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de docentes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const listarDocentes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/docentes/`);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de docentes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerDocentePorId = async (docenteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/docentes/${docenteId}`);
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de docentes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const actualizarDocente = async (docenteId, datos) => {
  try {
    // Si se actualiza la contraseña, hashearla antes de enviar
    const payload = { ...datos };
    if (payload.contraseña) {
      payload.contraseña = await hashPassword(payload.contraseña);
    }

    const response = await fetch(`${API_BASE_URL}/docentes/${docenteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de docentes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const eliminarDocente = async (docenteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/docentes/${docenteId}`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error("No se pudo conectar con la API de docentes");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerEstudiantesCalificaciones = async (docenteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/docentes/${docenteId}/estudiantes-calificaciones`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener los estudiantes con calificaciones");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};
