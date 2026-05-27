import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getDocenteDashboardStats } from "../../services/dashboardService";
import { obtenerHorarioDocente } from "../../services/cursoService";
import { DOCENTE_ROUTES } from "../../constant/routes";
import { gradientBanner, dayColors } from "../../theme";
import dashStyles                    from "../../styles/Dashboards.module.css";

const DIAS_SEMANA = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

const styles = {
  page:  { padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" },
  banner: {
    background: gradientBanner,
    borderRadius: "12px", padding: "18px 24px", marginBottom: "14px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  bannerLeft:  { display: "flex", alignItems: "center", gap: "14px" },
  avatar: {
    width: "48px", height: "48px", borderRadius: "12px",
    background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px", fontWeight: 800, color: "#fff", flexShrink: 0,
  },
  bannerTitle: { fontSize: "17px", fontWeight: 800, color: "#fff", marginBottom: "3px" },
  bannerSub:   { fontSize: "12.5px", color: "rgba(255,255,255,.6)" },
  bannerBadge: {
    padding: "5px 14px", borderRadius: "20px",
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
    fontSize: "12px", fontWeight: 600, color: "#fff",
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "12px" },
  statCard: (color, bg) => ({
    background: "#fff", borderRadius: "10px", padding: "15px 17px",
    border: "1px solid #dde3ec", borderLeft: `4px solid ${color}`,
    display: "flex", alignItems: "center", gap: "12px",
  }),
  statIcon: (bg) => ({
    width: "42px", height: "42px", borderRadius: "9px", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", flexShrink: 0,
  }),
  statNum:   { fontSize: "26px", fontWeight: 800, color: "#0f2744", lineHeight: 1 },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "3px", fontWeight: 500 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 240px", gap: "12px" },
  card: { background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "15px" },
  cardTitle: {
    fontSize: "11px", fontWeight: 700, color: "#0f2744",
    textTransform: "uppercase", letterSpacing: "0.6px",
    marginBottom: "11px", paddingBottom: "8px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  linkBtn: {
    fontSize: "10px", fontWeight: 600, color: "#1e40af",
    background: "none", border: "none", cursor: "pointer",
    padding: 0, textDecoration: "underline",
  },
  quickBtn: {
    width: "100%", padding: "8px 10px", borderRadius: "7px",
    border: "1px solid #dde3ec", background: "#f8fafc",
    color: "#0f2744", fontSize: "12px", fontWeight: 600,
    cursor: "pointer", marginBottom: "6px",
    display: "flex", alignItems: "center", gap: "7px", textAlign: "left",
  },
};

const DashboardDocente = () => {
  const navigate    = useNavigate();
  const { usuario } = useAuth();

  const [stats,    setStats]    = useState({ mis_cursos: 0, total_estudiantes: 0, material_subido: 0 });
  const [horarios, setHorarios] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [statsData, horariosData] = await Promise.all([
          getDocenteDashboardStats(usuario.id),
          obtenerHorarioDocente(usuario.id),
        ]);
        setStats(statsData);
        if (!horariosData?.error && Array.isArray(horariosData)) setHorarios(horariosData);
      } catch (err) {
        console.error("[DashboardDocente]", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuario]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const inicial = (usuario?.nombres || "D").charAt(0).toUpperCase();
  const nombre  = `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim();

  const statCards = [
    { label: "Mis Cursos",  value: stats.mis_cursos,        icon: "📚", color: "#1e40af", bg: "#eff6ff" },
    { label: "Estudiantes", value: stats.total_estudiantes, icon: "👥", color: "#15803d", bg: "#f0fdf4" },
    { label: "Materiales",  value: stats.material_subido,   icon: "📁", color: "#d97706", bg: "#fffbeb" },
  ];

  const diasConClases = DIAS_SEMANA.filter((dia) => horarios.some((h) => h.dia === dia));

  return (
    <div className={dashStyles.page}>

      <div style={styles.banner}>
        <div style={styles.bannerLeft}>
          <div style={styles.avatar}>{inicial}</div>
          <div>
            <div style={styles.bannerTitle}>Bienvenido, {nombre}</div>
            <div style={styles.bannerSub}>Panel del Docente · EduCampus</div>
          </div>
        </div>
        <div style={styles.bannerBadge}>👨‍🏫 Docente</div>
      </div>

      <div className={dashStyles.statsRow3}>
        {statCards.map((s, i) => (
          <div key={i} style={styles.statCard(s.color, s.bg)}>
            <div style={styles.statIcon(s.bg)}>{s.icon}</div>
            <div>
              <div style={styles.statNum}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={dashStyles.twoColSide}>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            📆 Mi Horario Semanal
            <button style={styles.linkBtn} onClick={() => navigate(DOCENTE_ROUTES.CURSOS)}>
              Ver cursos →
            </button>
          </div>

          {diasConClases.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: "12.5px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "6px" }}>📅</div>
              Sin clases programadas
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {diasConClases.map((dia, di) => {
                const color  = dayColors[di % dayColors.length];
                const clases = horarios.filter((h) => h.dia === dia);
                return (
                  <div key={dia} style={{ borderRadius: "9px", overflow: "hidden", border: "1px solid #e5e9f0" }}>
                    <div style={{ background: color, padding: "5px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                        {dia}
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: "9px", fontWeight: 700, borderRadius: "8px", padding: "1px 7px" }}>
                        {clases.length} clase{clases.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {clases.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "#fff", borderBottom: i < clases.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <div style={{ background: `${color}18`, border: `1px solid ${color}40`, borderRadius: "6px", padding: "3px 9px", flexShrink: 0 }}>
                          <span style={{ fontSize: "10.5px", fontWeight: 800, color }}>{c.hora || "—"}</span>
                        </div>
                        <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f2744", flex: 1 }}>{c.nombre_curso}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Acciones Rápidas</div>
          <button style={styles.quickBtn} onClick={() => navigate(DOCENTE_ROUTES.CURSOS)}>
            📚 Mis Cursos
          </button>
          <button style={styles.quickBtn} onClick={() => navigate(DOCENTE_ROUTES.ESTUDIANTES)}>
            👥 Ver Estudiantes
          </button>
          <button style={styles.quickBtn} onClick={() => navigate(DOCENTE_ROUTES.ASISTENCIA)}>
            📅 Registrar Asistencia
          </button>
          <button style={styles.quickBtn} onClick={() => navigate(DOCENTE_ROUTES.CALIFICACIONES)}>
            📝 Calificaciones
          </button>
          <button style={styles.quickBtn} onClick={() => navigate(DOCENTE_ROUTES.MATERIAL)}>
            📁 Material Didáctico
          </button>
          <button style={{ ...styles.quickBtn, marginBottom: 0 }} onClick={() => navigate(DOCENTE_ROUTES.CALENDARIO)}>
            🗓️ Calendario
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardDocente;
