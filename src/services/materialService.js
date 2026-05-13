const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const subirMaterial = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/material/upload`, {
      method: "POST",
      body: formData, // FormData se envía sin Content-Type
    });
    if (!response.ok) throw new Error("No se pudo subir el material didáctico");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerMaterialPorCurso = async (cursoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/material/por-curso/${cursoId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el material del curso");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerMaterialPorDocente = async (docenteId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/material/por-docente/${docenteId}`
    );
    if (!response.ok)
      throw new Error("No se pudo obtener el material del docente");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const obtenerUrlDescarga = async (materialId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/material/descargar/${materialId}`
    );
    if (!response.ok) throw new Error("No se pudo obtener la URL de descarga");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const eliminarMaterial = async (materialId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/material/${materialId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("No se pudo eliminar el material");
    // 204 No Content no tiene body, retornar success
    if (response.status === 204) {
      return { error: false, message: "Material eliminado exitosamente" };
    }
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};
