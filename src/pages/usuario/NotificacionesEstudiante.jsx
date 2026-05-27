import React, { useEffect, useState, useCallback } from "react";

import { useAuth }  from "../../context/AuthContext";
import BannerPage   from "../../components/estudiante/BannerPage";
import {
  obtenerNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
} from "../../services/notificacionesService";

const ICONOS = {
  bienvenida:   "👋",
  calificacion: "📊",
  inscripcion:  "🎓",
  material:     "📁",
  info:         "🔔",
};
const COLORES = {
  bienvenida:   { bg: "#eff6ff", border: "#1e40af", icon: "#1e40af" },
  calificacion: { bg: "#f0fdf4", border: "#15803d", icon: "#15803d" },
  inscripcion:  { bg: "#fdf4ff", border: "#7e22ce", icon: "#7e22ce" },
  material:     { bg: "#fff7ed", border: "#c2410c", icon: "#c2410c" },
  info:         { bg: "#f0f4f8", border: "#475569", icon: "#475569" },
};

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100vh" },

  empty:     { textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "12px", color: "#94a3b8", fontSize: "15px" },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },

  card: {
    background:   "#fff",
    borderRadius: "12px",
    marginBottom: "12px",
    padding:      "16px 20px",
    display:      "flex",
    alignItems:   "flex-start",
    gap:          "14px",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.07)",
  },
  iconBox: {
    width:          "40px",
    height:         "40px",
    borderRadius:   "10px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "18px",
    flexShrink:     0,
  },
  unreadBar: { width: "4px", borderRadius: "4px", alignSelf: "stretch", flexShrink: 0 },

  cardBody:  { flex: 1 },
  cardTitle: { fontWeight: 700, fontSize: "14px", color: "#1e293b", margin: "0 0 4px" },
  cardMsg:   { fontSize: "13px", color: "#475569", margin: "0 0 6px", lineHeight: 1.5 },
  cardDate:  { fontSize: "11px", color: "#94a3b8" },
  badge: {
    display:      "inline-block",
    fontSize:     "10px",
    fontWeight:   700,
    padding:      "2px 7px",
    borderRadius: "20px",
    background:   "#dbeafe",
    color:        "#1e40af",
    marginLeft:   "8px",
  },

  actions: { display: "flex", gap: "8px", flexShrink: 0 },
  btnRead: {
    background:   "#eff6ff",
    border:       "none",
    color:        "#1e40af",
    padding:      "5px 10px",
    borderRadius: "6px",
    cursor:       "pointer",
    fontSize:     "12px",
  },
  btnDel: {
    background:   "#fef2f2",
    border:       "none",
    color:        "#dc2626",
    padding:      "5px 10px",
    borderRadius: "6px",
    cursor:       "pointer",
    fontSize:     "12px",
  },

  btnMarkAll: {
    padding:      "9px 18px",
    background:   "rgba(255,255,255,0.15)",
    border:       "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px",
    color:        "#fff",
    fontWeight:   700,
    fontSize:     "12.5px",
    cursor:       "pointer",
  },
};

function formatFecha(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function NotificacionesEstudiante() {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading,        setLoading]        = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    const data = await obtenerNotificaciones("estudiante", usuario.id);
    setNotificaciones(data);
    setLoading(false);
  }, [usuario]);

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 30000);
    return () => clearInterval(intervalo);
  }, [cargar]);

  const handleLeer = async (id) => {
    await marcarLeida(id);
    setNotificaciones((prev) =>
      prev.map((n) => (n.id_notificacion === id ? { ...n, leida: true } : n))
    );
  };

  const handleEliminar = async (id) => {
    await eliminarNotificacion(id);
    setNotificaciones((prev) => prev.filter((n) => n.id_notificacion !== id));
  };

  const handleTodasLeidas = async () => {
    if (!usuario?.id) return;
    await marcarTodasLeidas("estudiante", usuario.id);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <BannerPage
        icono="🔔"
        titulo="Mis Notificaciones"
        subtitulo={
          noLeidas > 0
            ? `Tienes ${noLeidas} notificacion${noLeidas > 1 ? "es" : ""} sin leer`
            : "Todas las notificaciones leidas"
        }
        extra={
          noLeidas > 0 ? (
            <button style={styles.btnMarkAll} onClick={handleTodasLeidas}>
              ✓ Marcar todas como leidas
            </button>
          ) : null
        }
      />

      {notificaciones.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <p>No tienes notificaciones</p>
        </div>
      ) : (
        notificaciones.map((notif) => {
          const tipo = notif.tipo || "info";
          const col  = COLORES[tipo] || COLORES.info;
          return (
            <div
              key={notif.id_notificacion}
              style={{
                ...styles.card,
                borderLeft: `4px solid ${col.border}`,
                opacity: notif.leida ? 0.75 : 1,
              }}
            >
              {!notif.leida && (
                <div style={{ ...styles.unreadBar, background: col.border }} />
              )}

              <div style={{ ...styles.iconBox, background: col.bg, color: col.icon }}>
                {ICONOS[tipo] || "🔔"}
              </div>

              <div style={styles.cardBody}>
                <p style={styles.cardTitle}>
                  {notif.titulo}
                  {!notif.leida && <span style={styles.badge}>NUEVO</span>}
                </p>
                <p style={styles.cardMsg}>{notif.mensaje}</p>
                <span style={styles.cardDate}>{formatFecha(notif.fecha_creacion)}</span>
              </div>

              <div style={styles.actions}>
                {!notif.leida && (
                  <button style={styles.btnRead} onClick={() => handleLeer(notif.id_notificacion)}>
                    ✓ Leido
                  </button>
                )}
                <button style={styles.btnDel} onClick={() => handleEliminar(notif.id_notificacion)}>
                  🗑
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
