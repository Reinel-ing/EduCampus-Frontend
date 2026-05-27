/**
 * notificacionesService.js
 * Comunicación con el endpoint /notificaciones de la API.
 *
 * Las funciones retornan valores seguros ante errores de red para que
 * los componentes puedan renderizarse sin manejar excepciones.
 */

const API = import.meta.env.VITE_API_BASE_URL;


/**
 * Obtiene el historial completo de notificaciones de un usuario.
 * @param {string} tipo - Rol ('admin' | 'docente' | 'estudiante').
 * @param {number} id   - ID del usuario.
 * @returns {Promise<Array>}
 */
export const obtenerNotificaciones = async (tipo, id) => {
  try {
    const res = await fetch(`${API}/notificaciones/${tipo}/${id}`);
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
};


/**
 * Devuelve el número de notificaciones no leídas.
 * Usado por el Sidebar para mostrar el badge rojo en tiempo real.
 * @param {string} tipo - Rol del usuario.
 * @param {number} id   - ID del usuario.
 * @returns {Promise<number>}
 */
export const contarNoLeidas = async (tipo, id) => {
  try {
    const res  = await fetch(`${API}/notificaciones/${tipo}/${id}/no-leidas`);
    const data = res.ok ? await res.json() : {};
    return data.no_leidas ?? 0;
  } catch {
    return 0;
  }
};


/**
 * Marca una notificación específica como leída.
 * @param {number} idNotificacion
 */
export const marcarLeida = async (idNotificacion) => {
  try {
    const res = await fetch(`${API}/notificaciones/${idNotificacion}/leer`, {
      method: "PUT",
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
};


/**
 * Marca todas las notificaciones de un usuario como leídas de una vez.
 * @param {string} tipo - Rol del usuario.
 * @param {number} id   - ID del usuario.
 */
export const marcarTodasLeidas = async (tipo, id) => {
  try {
    const res = await fetch(`${API}/notificaciones/${tipo}/${id}/leer-todas`, {
      method: "PUT",
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
};


/**
 * Elimina permanentemente una notificación.
 * @param {number} idNotificacion
 * @returns {Promise<boolean>}
 */
export const eliminarNotificacion = async (idNotificacion) => {
  try {
    const res = await fetch(`${API}/notificaciones/${idNotificacion}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
};
