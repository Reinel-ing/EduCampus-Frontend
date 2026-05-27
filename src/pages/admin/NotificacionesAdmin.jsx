import dashStyles from "../../styles/Dashboards.module.css";
import React, { useState, useEffect, useCallback } from "react";

import { useAuth }    from "../../context/AuthContext";
import BannerPage     from "../../components/estudiante/BannerPage";
import {
  obtenerNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
} from "../../services/notificacionesService";

const TIPO_CONFIG = {
  sistema:      { icon: "✅", color: "green",  label: "Sistema"  },
  bienvenida:   { icon: "👋", color: "blue",   label: "Sistema"  },
  calificacion: { icon: "📊", color: "green",  label: "Sistema"  },
  inscripcion:  { icon: "🎓", color: "blue",   label: "Info"     },
  material:     { icon: "📁", color: "yellow", label: "Sistema"  },
  alerta:       { icon: "⚠️", color: "red",    label: "Alerta"   },
  info:         { icon: "ℹ️", color: "blue",   label: "Info"     },
};

const BG = {
  red:    { bg: "#fef2f2", border: "#fecaca", text: "#dc2626", iconBg: "#fecaca" },
  green:  { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", iconBg: "#bbf7d0" },
  yellow: { bg: "#fffbeb", border: "#fde68a", text: "#d97706", iconBg: "#fde68a" },
  blue:   { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", iconBg: "#bfdbfe" },
};

const TIPOS_SISTEMA = ["sistema", "bienvenida", "calificacion", "material"];
const TIPOS_INFO    = ["info", "inscripcion"];

const FILTROS = [
  { key: "todas",   label: "Todas"   },
  { key: "nuevas",  label: "Nuevas"  },
  { key: "sistema", label: "Sistema" },
  { key: "info",    label: "Info"    },
  { key: "alerta",  label: "Alertas" },
];

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100vh" },

  statsGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap:                 "12px",
    marginBottom:        "20px",
  },
  statCard: (color) => ({
    background:   "#fff",
    borderRadius: "10px",
    padding:      "14px 16px",
    border:       "1px solid #dde3ec",
    borderLeft:   `4px solid ${color}`,
  }),
  statVal:   { fontSize: "22px", fontWeight: 800, color: "#0f2744" },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },

  tabs: { display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" },
  tab: (active) => ({
    padding:     "6px 16px",
    borderRadius: "6px",
    fontSize:    "12px",
    fontWeight:  600,
    cursor:      "pointer",
    border:      "1px solid",
    background:  active ? "#1e40af" : "#fff",
    color:       active ? "#fff"    : "#6b7280",
    borderColor: active ? "#1e40af" : "#dde3ec",
  }),

  card: { background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "16px" },
  cardHeader: {
    fontSize:       "11px",
    fontWeight:     700,
    color:          "#0f2744",
    textTransform:  "uppercase",
    letterSpacing:  "0.6px",
    marginBottom:   "12px",
    paddingBottom:  "8px",
    borderBottom:   "1px solid #f3f4f6",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  badgeCount: {
    fontSize:     "9.5px",
    fontWeight:   700,
    padding:      "2px 8px",
    borderRadius: "4px",
    background:   "#eff6ff",
    color:        "#1e40af",
    border:       "1px solid #bfdbfe",
  },

  item: (color) => ({
    display:      "flex",
    alignItems:   "flex-start",
    gap:          "12px",
    padding:      "12px 14px",
    borderRadius: "8px",
    marginBottom: "8px",
    background:   BG[color]?.bg     || "#eff6ff",
    border:       `1px solid ${BG[color]?.border || "#bfdbfe"}`,
  }),
  iconBox: (color) => ({
    width:          "36px",
    height:         "36px",
    borderRadius:   "8px",
    flexShrink:     0,
    background:     BG[color]?.iconBg || "#bfdbfe",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "16px",
  }),
  itemTitle: { fontSize: "13px", fontWeight: 600, color: "#0f2744", marginBottom: "2px" },
  itemDesc:  { fontSize: "12px", color: "#6b7280", lineHeight: 1.4 },
  itemTime:  { fontSize: "10.5px", color: "#9ca3af", marginTop: "4px" },

  tipoBadge: (color) => ({
    fontSize:     "9.5px",
    fontWeight:   700,
    padding:      "2px 8px",
    borderRadius: "4px",
    background:   BG[color]?.bg   || "#eff6ff",
    color:        BG[color]?.text || "#1e40af",
    border:       `1px solid ${BG[color]?.border || "#bfdbfe"}`,
    whiteSpace:   "nowrap",
    flexShrink:   0,
  }),
  nuevaBadge: {
    fontSize:     "9.5px",
    fontWeight:   700,
    padding:      "2px 8px",
    borderRadius: "4px",
    background:   "#eff6ff",
    color:        "#1e40af",
    border:       "1px solid #bfdbfe",
  },
  actions: { display: "flex", gap: "6px", flexShrink: 0, alignItems: "flex-start" },
  btnLeer: {
    background:   "#eff6ff",
    border:       "none",
    color:        "#1e40af",
    padding:      "4px 9px",
    borderRadius: "5px",
    cursor:       "pointer",
    fontSize:     "11px",
  },
  btnDel: {
    background:   "#fef2f2",
    border:       "none",
    color:        "#dc2626",
    padding:      "4px 9px",
    borderRadius: "5px",
    cursor:       "pointer",
    fontSize:     "11px",
  },
  empty: { textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: "13px" },

  btnMarkAll: {
    padding:      "9px 18px",
    background:   "rgba(255,255,255,0.18)",
    border:       "1px solid rgba(255,255,255,0.35)",
    borderRadius: "8px",
    color:        "#fff",
    fontWeight:   700,
    fontSize:     "13px",
    cursor:       "pointer",
  },
};

function tiempoRelativo(fecha) {
  if (!fecha) return "";
  const diff = (Date.now() - new Date(fecha).getTime()) / 1000;
  if (diff < 60)     return "Hace un momento";
  if (diff < 3600)   return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400)  return `Hace ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return "Ayer";
  return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export default function NotificacionesAdmin() {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro,         setFiltro]         = useState("todas");
  const [loading,        setLoading]        = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    const data = await obtenerNotificaciones("admin", usuario.id);
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
    await marcarTodasLeidas("admin", usuario.id);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;
  const nSistema = notificaciones.filter((n) => TIPOS_SISTEMA.includes(n.tipo)).length;
  const nInfo    = notificaciones.filter((n) => TIPOS_INFO.includes(n.tipo)).length;
  const nAlerta  = notificaciones.filter((n) => n.tipo === "alerta").length;

  const filtradas = notificaciones.filter((n) => {
    if (filtro === "nuevas")  return !n.leida;
    if (filtro === "sistema") return TIPOS_SISTEMA.includes(n.tipo);
    if (filtro === "info")    return TIPOS_INFO.includes(n.tipo);
    if (filtro === "alerta")  return n.tipo === "alerta";
    return true;
  });

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={dashStyles.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <BannerPage
        icono="🔔"
        titulo="Centro de Notificaciones"
        subtitulo={
          noLeidas > 0
            ? `${noLeidas} notificacion${noLeidas > 1 ? "es" : ""} sin leer`
            : "Todo al dia — sin notificaciones pendientes"
        }
        extra={
          noLeidas > 0 ? (
            <button style={styles.btnMarkAll} onClick={handleTodasLeidas}>
              ✓ Marcar todas como leidas
            </button>
          ) : null
        }
      />

      <div style={styles.statsGrid}>
        {[
          { label: "Total",   value: notificaciones.length, color: "#1e40af" },
          { label: "Nuevas",  value: noLeidas,              color: "#dc2626" },
          { label: "Sistema", value: nSistema,              color: "#15803d" },
          { label: "Info",    value: nInfo,                 color: "#d97706" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard(s.color)}>
            <div style={styles.statVal}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.tabs}>
        {FILTROS.map((f) => {
          const count =
            f.key === "nuevas"  ? noLeidas :
            f.key === "sistema" ? nSistema :
            f.key === "info"    ? nInfo    :
            f.key === "alerta"  ? nAlerta  : null;
          return (
            <button
              key={f.key}
              style={styles.tab(filtro === f.key)}
              onClick={() => setFiltro(f.key)}
            >
              {f.label}{count !== null ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {filtro === "todas"   ? "Todas las notificaciones"  :
           filtro === "nuevas"  ? "Notificaciones nuevas"      :
           filtro === "sistema" ? "Notificaciones del sistema" :
           filtro === "info"    ? "Informacion"                :
                                  "Alertas"}
          <span style={styles.badgeCount}>{filtradas.length} registros</span>
        </div>

        {filtradas.length === 0 ? (
          <div style={styles.empty}>
            {noLeidas === 0 && filtro === "nuevas"
              ? "✅ No hay notificaciones nuevas"
              : "No hay notificaciones en esta categoria"}
          </div>
        ) : (
          filtradas.map((notif) => {
            const cfg   = TIPO_CONFIG[notif.tipo] || TIPO_CONFIG.info;
            const color = cfg.color;
            return (
              <div
                key={notif.id_notificacion}
                style={{ ...styles.item(color), opacity: notif.leida ? 0.7 : 1 }}
              >
                <div style={styles.iconBox(color)}>{cfg.icon}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", flexWrap: "wrap" }}>
                    <span style={styles.itemTitle}>{notif.titulo}</span>
                    {!notif.leida && <span style={styles.nuevaBadge}>Nueva</span>}
                  </div>
                  <div style={styles.itemDesc}>{notif.mensaje}</div>
                  <div style={styles.itemTime}>{tiempoRelativo(notif.fecha_creacion)}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                  <span style={styles.tipoBadge(color)}>{cfg.label}</span>
                  <div style={styles.actions}>
                    {!notif.leida && (
                      <button style={styles.btnLeer} onClick={() => handleLeer(notif.id_notificacion)}>
                        ✓
                      </button>
                    )}
                    <button style={styles.btnDel} onClick={() => handleEliminar(notif.id_notificacion)}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
