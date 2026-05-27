import React from "react";

const ESTADOS = {
  aprobado:    { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", label: "Aprobado"    },
  reprobado:   { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Reprobado"   },
  en_progreso: { bg: "#eff6ff", border: "#bfdbfe", color: "#1e40af", label: "En Progreso" },
  presente:    { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", label: "Presente"    },
  ausente:     { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Ausente"     },
  entregado:   { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", label: "Entregado"   },
  pendiente:   { bg: "#fffbeb", border: "#fde68a", color: "#d97706", label: "Pendiente"   },
  vencido:     { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Vencida"     },
  activo:      { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", label: "Activo"      },
};

const baseStyle = {
  display:      "inline-flex",
  alignItems:   "center",
  gap:          "4px",
  padding:      "3px 10px",
  borderRadius: "20px",
  fontSize:     "11.5px",
  fontWeight:   700,
};

// tipo="nota" calcula color segun escala 0-5
const EstadoBadge = ({ tipo, nota }) => {
  if (tipo === "nota" && nota != null) {
    const n      = Number(nota);
    const estado = n >= 3.0 ? ESTADOS.aprobado : ESTADOS.reprobado;
    return (
      <span style={{ ...baseStyle, background: estado.bg, border: `1px solid ${estado.border}`, color: estado.color }}>
        {n.toFixed(1)}/5.0 — {n >= 3.0 ? "Aprobado" : "No aprobado"}
      </span>
    );
  }

  const conf = ESTADOS[tipo];
  if (!conf) return null;

  return (
    <span style={{ ...baseStyle, background: conf.bg, border: `1px solid ${conf.border}`, color: conf.color }}>
      {conf.label}
    </span>
  );
};

export default EstadoBadge;
