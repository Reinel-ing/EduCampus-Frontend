/**
 * theme.js
 * Constantes de diseño compartidas en toda la aplicación.
 * Centraliza colores, gradientes y estilos base para mantener
 * consistencia visual sin repetir valores en cada componente.
 */

export const colors = {
  primary:      "#1e40af",
  primaryDark:  "#0f2744",
  success:      "#15803d",
  warning:      "#d97706",
  danger:       "#dc2626",
  purple:       "#7c3aed",
  teal:         "#0891b2",
  gray:         "#6b7280",
  grayLight:    "#f0f4f8",
  border:       "#dde3ec",
};

export const gradientBanner = "linear-gradient(135deg, #0f2744 0%, #1e40af 100%)";

/** Paleta para diferenciar días de la semana en el horario */
export const dayColors = [
  "#1e40af", // Lunes   – azul institucional
  "#15803d", // Martes  – verde
  "#7c3aed", // Miércoles – púrpura
  "#d97706", // Jueves  – ámbar
  "#0891b2", // Viernes – teal
  "#be185d", // Sábado  – rosa
  "#374151", // Domingo – gris oscuro
];

/** Estilos de badge por estado (aprobado / pendiente / vencido) */
export const badge = {
  green:  { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" },
  yellow: { background: "#fffbeb", border: "1px solid #fde68a", color: "#d97706" },
  red:    { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" },
  blue:   { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af" },
};

/** Estilo base para tarjetas blancas con sombra sutil */
export const card = {
  background:   "#fff",
  borderRadius: "12px",
  boxShadow:    "0 1px 4px rgba(0,0,0,0.07)",
  border:       "1px solid #dde3ec",
};

/** Banner institucional reutilizable */
export const banner = {
  background:    gradientBanner,
  borderRadius:  "12px",
  padding:       "18px 24px",
  marginBottom:  "16px",
  display:       "flex",
  alignItems:    "center",
  justifyContent:"space-between",
};
