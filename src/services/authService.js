const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Iniciar sesión
export const iniciarSesion = async (correo, contraseña) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
  correo,
  contraseña,
}),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Credenciales incorrectas");
      }
      throw new Error("Error al iniciar sesión");
    }

    const userData = await response.json();

    // Guardar datos del usuario en localStorage
    localStorage.setItem("usuario", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    return { error: false, data: userData };
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Cerrar sesión
export const cerrarSesion = () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("isAuthenticated");
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};

// Verificar si está autenticado
export const estaAutenticado = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Verificar rol del usuario
export const obtenerRolUsuario = () => {
  const usuario = obtenerUsuarioActual();
  return usuario?.rol || null;
};
