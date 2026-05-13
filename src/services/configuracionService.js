const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Crear configuración
export const crearConfiguracion = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/configuracion/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error("No se pudo crear la configuración");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Obtener configuración
export const obtenerConfiguracion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/configuracion/`);
    if (!response.ok) throw new Error("No se pudo obtener la configuración");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Actualizar configuración
export const actualizarConfiguracion = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/configuracion/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error("No se pudo actualizar la configuración");
    return response.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
};
