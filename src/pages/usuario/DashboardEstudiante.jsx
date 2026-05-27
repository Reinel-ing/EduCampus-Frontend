import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getEstudianteDashboardStats } from "../../services/dashboardService";
import { obtenerHorarioEstudiante, obtenerCursosPorEstudiante } from "../../services/cursoService";
import { obtenerCalificacionesPorEstudiante } from "../../services/calificacionService";
import { USUARIO_ROUTES } from "../../constant/routes";
import { gradientBanner, dayColors } from "../../theme";
import dashStyles                    from "../../styles/Dashboards.module.css";

const DIAS_SEMANA = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

// escala 0-5: verde>=3.0, amarillo>=2.0, rojo<2.0
function colorPorNota(nota) {
  const n = Number(nota);
  if (n >= 3.0) return "green";
  if (n >= 2.0) return "yellow";
  return "red";
}

const styles = {
  page: {
    padding: "22px 24px",
    background: "#f0f4f8",
    minHeight: "100%",
    boxSizing: "border-box",
  },
  banner: {
    background: gradientBanner,
    borderRadius: "12px",
    padding: "18px 24px",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerLeft: { display: "flex", alignItems: "center", gap: "14px" },
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
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px", marginBottom: "12px",
  },
  statCard: (color) => ({
    background: "#fff", borderRadius: "10px", padding: "15px 17px",
    border: "1px solid #dde3ec", borderLeft: `4px solid ${color}`,
    display: "flex", alignItems: "center", gap: "12px",
  }),
  statIcon: (bg) => ({
    width: "42px", height: "42px", borderRadius: "9px", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", flexShrink: 0,
  }),
  statNum:   { fontSize: "24px", fontWeight: 800, color: "#0f2744", lineHeight: 1 },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "3px", fontWeight: 500 },
  threeCol:  { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" },
  twoCol:    { display: "grid", gridTemplateColumns: "1fr 1fr",     gap: "12px", marginBottom: "12px" },
  card: {
    background: "#fff", borderRadius: "10px",
    border: "1px solid #dde3ec", padding: "15px",
  },
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
  califRow:   { display: "flex", alignItems: "center", gap: "10px", padding: "7px 0" },
  califCurso: { fontSize: "12.5px", color: "#374151", flex: 1, fontWeight: 500 },
  califNota:  { fontSize: "14px", fontWeight: 800, color: "#0f2744" },
  badge: (color) => ({
    fontSize: "9.5px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px",
    background: color === "green" ? "#f0fdf4" : color === "red" ? "#fef2f2" : "#fffbeb",
    color:      color === "green" ? "#15803d" : color === "red" ? "#dc2626" : "#d97706",
    border: `1px solid ${color === "green" ? "#bbf7d0" : color === "red" ? "#fecaca" : "#fde68a"}`,
  }),
  progItem:  { marginBottom: "11px" },
  progRow:   { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  progLabel: { fontSize: "12px", color: "#374151" },
  progVal:   { fontSize: "11.5px", fontWeight: 700, color: "#1e40af" },
  progTrack: { height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" },
  progFill:  (pct, color = "#1e40af") => ({
    height: "100%", width: `${Math.min(pct, 100)}%`,
    background: color, borderRadius: "3px",
  }),
  infoRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 0", borderBottom: "1px solid #f3f4f6",
  },
  infoLabel: { fontSize: "12px", color: "#6b7280" },
  infoValue: { fontSize: "12.5px", fontWeight: 600, color: "#374151" },
  quickBtn: {
    width: "100%", padding: "8px 10px", borderRadius: "7px",
    border: "1px solid #dde3ec", background: "#f8fafc",
    color: "#0f2744", fontSize: "12px", fontWeight: 600,
    cursor: "pointer", marginBottom: "6px",
    display: "flex", alignItems: "center", gap: "7px", textAlign: "left",
  },
};

const DashboardEstudiante = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [stats,          setStats]          = useState({ mis_cursos: 0, mi_promedio: 0, mi_asistencia: 0 });
  const [horarios,       setHorarios]       = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [cursos,         setCursos]         = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [statsData, horariosData, califData, cursosData] = await Promise.all([
          getEstudianteDashboardStats(usuario.id),
          obtenerHorarioEstudiante(usuario.id),
          obtenerCalificacionesPorEstudiante(usuario.id),
          obtenerCursosPorEstudiante(usuario.id),
        ]);
        setStats(statsData);
        if (!horariosData?.error)  setHorarios(Array.isArray(horariosData) ? horariosData : []);
        if (!califData?.error)     setCalificaciones(Array.isArray(califData)  ? califData  : []);
        if (!cursosData?.error)    setCursos(Array.isArray(cursosData)         ? cursosData : []);
      } catch (err) {
        console.error("[DashboardEstudiante]", err);
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

  const promedio   = Number(stats.mi_promedio).toFixed(1);
  const asistencia = Number(stats.mi_asistencia).toFixed(0);
  const inicial    = (usuario?.nombres || "E").charAt(0).toUpperCase();
  const nombre     = `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim();

  const statCards = [
    { label: "Mis Cursos",     value: stats.mis_cursos,   icon: "📚", color: "#1e40af", bg: "#eff6ff" },
    { label: "Promedio Gral.", value: promedio,            icon: "📊", color: "#15803d", bg: "#f0fdf4" },
    { label: "Asistencia",     value: `${asistencia}%`,   icon: "✅", color: "#d97706", bg: "#fffbeb" },
    { label: "Estado",         value: "Activo",            icon: "🏅", color: "#7c3aed", bg: "#f5f3ff" },
  ];

  const diasConClases = DIAS_SEMANA.filter((dia) => horarios.some((h) => h.dia === dia));

  const separador = (i, arr) => ({
    borderBottom: i < arr.length - 1 ? "1px solid #f9fafb" : "none",
  });

  return (
    <div className={dashStyles.page}>

      <div style={styles.banner}>
        <div style={styles.bannerLeft}>
          <div style={styles.avatar}>{inicial}</div>
          <div>
            <div style={styles.bannerTitle}>Bienvenido, {nombre}</div>
            <div style={styles.bannerSub}>Resumen de tu rendimiento académico · EduCampus</div>
          </div>
        </div>
        <div style={styles.bannerBadge}>🎓 Estudiante</div>
      </div>

      <div className={dashStyles.statsRow4}>
        {statCards.map((s, i) => (
          <div key={i} style={styles.statCard(s.color)}>
            <div style={styles.statIcon(s.bg)}>{s.icon}</div>
            <div>
              <div style={styles.statNum}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={dashStyles.threeCol}>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            📆 Mi Horario Semanal
            <button style={styles.linkBtn} onClick={() => navigate(USUARIO_ROUTES.HORARIO)}>
              Ver completo →
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
          <div style={styles.cardTitle}>
            Últimas Calificaciones
            <button style={styles.linkBtn} onClick={() => navigate(USUARIO_ROUTES.CALIFICACIONES)}>
              Ver todas →
            </button>
          </div>

          {calificaciones.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#9ca3af", fontSize: "12.5px" }}>
              📊 Sin calificaciones registradas
            </div>
          ) : (
            calificaciones.slice(0, 4).map((c, i, arr) => (
              <div key={i} style={{ ...styles.califRow, ...separador(i, arr) }}>
                <span style={styles.califCurso}>
                  {cursos.find((x) => x.id_curso === c.id_curso)?.nombre || `Curso #${c.id_curso}`}
                </span>
                <span style={styles.califNota}>{Number(c.nota).toFixed(1)}</span>
                <span style={styles.badge(colorPorNota(c.nota))}>
                  {Number(c.nota) >= 3.0 ? "Aprobado" : "Reprobado"}
                </span>
              </div>
            ))
          )}

          <button style={{ ...styles.quickBtn, marginTop: "8px", marginBottom: 0 }} onClick={() => navigate(USUARIO_ROUTES.CALIFICACIONES)}>
            📝 Ver todas mis calificaciones
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Mi Información</div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📧 Correo</span>
            <span style={{ ...styles.infoValue, fontSize: "11px" }}>{usuario?.correo || "—"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📞 Teléfono</span>
            <span style={styles.infoValue}>{usuario?.telefono || "No registrado"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>🎓 Estado</span>
            <span style={styles.badge("green")}>Activo</span>
          </div>
          <div style={{ ...styles.infoRow, borderBottom: "none" }}>
            <span style={styles.infoLabel}>📚 Cursos inscritos</span>
            <span style={styles.infoValue}>{stats.mis_cursos}</span>
          </div>
          <button style={{ ...styles.quickBtn, marginTop: "10px", marginBottom: 0 }} onClick={() => navigate(USUARIO_ROUTES.CURSOS)}>
            ➕ Inscribirse en un curso
          </button>
        </div>
      </div>

      <div className={dashStyles.twoCol}>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Progreso Académico
            <button style={styles.linkBtn} onClick={() => navigate(USUARIO_ROUTES.CALIFICACIONES)}>
              Ver detalle →
            </button>
          </div>

          <div style={styles.progItem}>
            <div style={styles.progRow}>
              <span style={styles.progLabel}>Asistencia general</span>
              <span style={styles.progVal}>{asistencia}%</span>
            </div>
            <div style={styles.progTrack}>
              <div style={styles.progFill(Number(asistencia), Number(asistencia) >= 80 ? "#15803d" : "#d97706")} />
            </div>
          </div>

          <div style={styles.progItem}>
            <div style={styles.progRow}>
              <span style={styles.progLabel}>Promedio general</span>
              <span style={styles.progVal}>{promedio} / 5.0</span>
            </div>
            <div style={styles.progTrack}>
              <div style={styles.progFill((Number(promedio) / 5) * 100, Number(promedio) >= 3.0 ? "#1e40af" : "#dc2626")} />
            </div>
          </div>

          <div style={styles.progItem}>
            <div style={styles.progRow}>
              <span style={styles.progLabel}>Cursos activos</span>
              <span style={styles.progVal}>{stats.mis_cursos} curso{stats.mis_cursos !== 1 ? "s" : ""}</span>
            </div>
            <div style={styles.progTrack}>
              <div style={styles.progFill(Math.min(100, stats.mis_cursos * 20))} />
            </div>
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            <button style={{ ...styles.quickBtn, marginBottom: 0, flex: 1 }} onClick={() => navigate(USUARIO_ROUTES.ASISTENCIA)}>
              📅 Ver asistencia
            </button>
            <button style={{ ...styles.quickBtn, marginBottom: 0, flex: 1 }} onClick={() => navigate(USUARIO_ROUTES.CALIFICACIONES)}>
              📝 Ver notas
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Mis Cursos
            <button style={styles.linkBtn} onClick={() => navigate(USUARIO_ROUTES.CURSOS)}>
              Ver todos →
            </button>
          </div>

          {cursos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#9ca3af", fontSize: "12.5px" }}>
              📚 No tienes cursos inscritos aún
            </div>
          ) : (
            cursos.slice(0, 4).map((c, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", ...separador(i, arr) }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                  📚
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>{c.nombre}</div>
                  <div style={{ fontSize: "10.5px", color: "#9ca3af" }}>
                    {c.docente ? `${c.docente.nombres} ${c.docente.apellidos}` : "Docente no asignado"}
                  </div>
                </div>
              </div>
            ))
          )}

          <button style={{ ...styles.quickBtn, marginTop: "10px", marginBottom: 0 }} onClick={() => navigate(USUARIO_ROUTES.MATERIALES)}>
            📂 Ver materiales de mis cursos
          </button>
        </div>
      </div>

    </div>
  );
};

export default DashboardEstudiante;
