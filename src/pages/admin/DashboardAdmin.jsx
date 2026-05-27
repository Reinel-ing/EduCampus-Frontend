import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminDashboardStats } from "../../services/dashboardService";
import { listarCursos }           from "../../services/cursoService";
import { listarDocentes }         from "../../services/docenteService";
import { listarEstudiantes }      from "../../services/estudianteService";
import { ADMIN_ROUTES }           from "../../constant/routes";
import { gradientBanner }         from "../../theme";

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" },

  banner: {
    background: gradientBanner,
    borderRadius: "12px",
    padding: "18px 24px",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: { fontSize: "17px", fontWeight: 800, color: "#fff", marginBottom: "3px" },
  bannerSub:   { fontSize: "12.5px", color: "rgba(255,255,255,.6)" },
  bannerIcon:  { fontSize: "38px", opacity: 0.75 },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "12px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "15px 17px",
    border: "1px solid #dde3ec",
    borderLeft: "4px solid #1e40af",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statIconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  statNum:   { fontSize: "26px", fontWeight: 800, color: "#0f2744", lineHeight: 1 },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "3px", fontWeight: 500 },

  fourCol:  { display: "grid", gridTemplateColumns: "repeat(4,1fr)",   gap: "12px", marginBottom: "12px" },
  threeCol: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr",    gap: "12px", marginBottom: "12px" },

  card: { background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "15px" },
  cardTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#0f2744",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "11px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewBtn: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#1e40af",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
    textTransform: "none",
    letterSpacing: 0,
  },

  badge: (color) => ({
    fontSize: "9.5px",
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: "4px",
    background: color === "green" ? "#f0fdf4" : color === "red" ? "#fef2f2" : "#fffbeb",
    color:      color === "green" ? "#15803d" : color === "red" ? "#dc2626" : "#d97706",
    border: `1px solid ${color === "green" ? "#bbf7d0" : color === "red" ? "#fecaca" : "#fde68a"}`,
  }),

  docenteItem: { display: "flex", alignItems: "center", gap: "9px", padding: "7px 0" },
  docenteAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    background: "#0f2744",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    flexShrink: 0,
  },
  docenteName: { fontSize: "12.5px", color: "#374151", fontWeight: 600 },
  docenteSpec: { fontSize: "10.5px", color: "#9ca3af" },

  progItem:  { marginBottom: "11px" },
  progRow:   { display: "flex", justifyContent: "space-between", marginBottom: "5px" },
  progLabel: { fontSize: "12.5px", color: "#374151" },
  progPct:   { fontSize: "11.5px", fontWeight: 700, color: "#1e40af" },
  progTrack: { height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" },
  progFill:  (w) => ({ height: "100%", borderRadius: "3px", background: "#1e40af", width: `${w}%` }),

  quickBtn: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "7px",
    border: "1px solid #dde3ec",
    background: "#f8fafc",
    color: "#0f2744",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    textAlign: "left",
  },
};

const DashboardAdminPage = () => {
  const navigate = useNavigate();

  const [stats,    setStats]    = useState({ total_estudiantes: 0, total_docentes: 0, total_cursos: 0, cursos_activos: 0 });
  const [cursos,   setCursos]   = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminDashboardStats(),
      listarCursos(),
      listarDocentes(),
      listarEstudiantes(),
    ])
      .then(([statsData, cursosData, docentesData]) => {
        setStats(statsData);
        setCursos(Array.isArray(cursosData)    ? cursosData    : []);
        setDocentes(Array.isArray(docentesData) ? docentesData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Usuarios",  value: stats.total_estudiantes + stats.total_docentes, icon: "👥" },
    { label: "Cursos Activos",  value: stats.cursos_activos,    icon: "📚" },
    { label: "Docentes",        value: stats.total_docentes,    icon: "👨‍🏫" },
    { label: "Estudiantes",     value: stats.total_estudiantes, icon: "🎓" },
  ];

  const accesosRapidos = [
    { icon: "📊", label: "Rendimiento",    desc: "Ver notas y desempeño",   ruta: ADMIN_ROUTES.RENDIMIENTO    },
    { icon: "📅", label: "Calendario",     desc: "Eventos académicos",       ruta: ADMIN_ROUTES.CALENDARIO     },
    { icon: "🔔", label: "Notificaciones", desc: "Alertas del sistema",      ruta: ADMIN_ROUTES.NOTIFICACIONES },
    { icon: "⚠️", label: "Alertas",        desc: "Tareas pendientes",        ruta: ADMIN_ROUTES.ALERTAS        },
  ];

  const progreso = [
    { label: "Cursos activos vs total",  pct: stats.total_cursos > 0 ? Math.round((stats.cursos_activos / stats.total_cursos) * 100) : 0 },
    { label: "Docentes registrados",     pct: Math.min(100, stats.total_docentes * 10) },
    { label: "Estudiantes matriculados", pct: Math.min(100, stats.total_estudiantes * 2) },
  ];

  const sep = (i, arr) => ({ borderBottom: i < arr.length - 1 ? "1px solid #f9fafb" : "none" });

  const cursosVisibles  = cursos.slice(0, 5);
  const docentesVisible = docentes.slice(0, 5);

  return (
    <div style={styles.page}>

      <div style={styles.banner}>
        <div>
          <div style={styles.bannerTitle}>Bienvenido al Panel de Administración</div>
          <div style={styles.bannerSub}>Resumen general del sistema educativo EduCampus</div>
        </div>
        <div style={styles.bannerIcon}>🏫</div>
      </div>

      <div style={styles.statsRow}>
        {statCards.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIconBox}>{s.icon}</div>
            <div>
              <div style={styles.statNum}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.fourCol}>
        {accesosRapidos.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.ruta)}
            style={{ background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "12px" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1e40af"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#dde3ec"; }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
              {a.icon}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f2744" }}>{a.label}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{a.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={styles.threeCol}>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Cursos Registrados
            <button style={styles.viewBtn} onClick={() => navigate(ADMIN_ROUTES.CURSOS)}>Ver todos →</button>
          </div>
          {cursosVisibles.length === 0 ? (
            <div style={{ fontSize: "12.5px", color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>
              No hay cursos registrados aún
            </div>
          ) : (
            cursosVisibles.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", ...sep(i, cursosVisibles) }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                  📚
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>{c.nombre}</div>
                  <div style={{ fontSize: "10.5px", color: "#9ca3af" }}>
                    {Array.isArray(c.horario) && c.horario.length > 0 ? c.horario.map(h => `${h.dia} ${h.hora}`).join(" · ") : "Sin horario"} · Cupo: {c.cupo_maximo || "—"}
                  </div>
                </div>
                <span style={styles.badge(c.estado ? "green" : "red")}>
                  {c.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
            ))
          )}
          <button style={{ ...styles.quickBtn, marginTop: "10px", marginBottom: 0 }} onClick={() => navigate(ADMIN_ROUTES.CURSOS)}>
            📚 Gestionar cursos
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Docentes Registrados
            <button style={styles.viewBtn} onClick={() => navigate(ADMIN_ROUTES.USUARIOS)}>Ver todos →</button>
          </div>
          {docentesVisible.length === 0 ? (
            <div style={{ fontSize: "12.5px", color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>
              No hay docentes registrados aún
            </div>
          ) : (
            docentesVisible.map((d, i) => (
              <div key={i} style={{ ...styles.docenteItem, ...sep(i, docentesVisible) }}>
                <div style={styles.docenteAvatar}>
                  {(d.nombres || d.nombre || "D").charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.docenteName}>
                    {d.nombres ? `${d.nombres} ${d.apellidos || ""}`.trim() : d.nombre || "Docente"}
                  </div>
                  <div style={styles.docenteSpec}>{d.especialidad || "Sin especialidad"}</div>
                </div>
                <span style={styles.badge(d.estado ? "green" : "red")}>
                  {d.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
            ))
          )}
          <button style={{ ...styles.quickBtn, marginTop: "10px", marginBottom: 0 }} onClick={() => navigate(ADMIN_ROUTES.USUARIOS)}>
            👨‍🏫 Gestionar usuarios
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Resumen General</div>
          {progreso.map((p, i) => (
            <div key={i} style={styles.progItem}>
              <div style={styles.progRow}>
                <span style={styles.progLabel}>{p.label}</span>
                <span style={styles.progPct}>{p.pct}%</span>
              </div>
              <div style={styles.progTrack}>
                <div style={styles.progFill(p.pct)} />
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "10px", marginTop: "4px" }}>
            <button style={styles.quickBtn} onClick={() => navigate(ADMIN_ROUTES.USUARIOS)}>👨‍🏫 Agregar Docente</button>
            <button style={styles.quickBtn} onClick={() => navigate(ADMIN_ROUTES.USUARIOS)}>🎓 Agregar Estudiante</button>
            <button style={styles.quickBtn} onClick={() => navigate(ADMIN_ROUTES.CURSOS)}>📚 Crear Curso</button>
            <button style={styles.quickBtn} onClick={() => navigate(ADMIN_ROUTES.MATRICULAS)}>📋 Nueva Matrícula</button>
            <button style={{ ...styles.quickBtn, marginBottom: 0 }} onClick={() => navigate(ADMIN_ROUTES.REPORTES)}>📊 Generar Reporte</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardAdminPage;
