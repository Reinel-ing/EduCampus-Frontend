import React, { useState, useEffect } from "react";

import { useAuth }                       from "../../context/AuthContext";
import { obtenerAsistenciaPorEstudiante } from "../../services/asistenciaService";
import { obtenerCursosPorEstudiante }    from "../../services/cursoService";
import BannerPage from "../../components/estudiante/BannerPage";

const styles = {
  page: {
    padding:    "22px 24px",
    background: "#f0f4f8",
    minHeight:  "100%",
    boxSizing:  "border-box",
  },

  statsRow: {
    display:             "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap:                 "12px",
    marginBottom:        "16px",
  },
  statCard: (color) => ({
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
    borderLeft:   `4px solid ${color}`,
    padding:      "14px 16px",
    display:      "flex",
    alignItems:   "center",
    gap:          "12px",
  }),
  statIcon: (bg) => ({
    width:          "40px",
    height:         "40px",
    borderRadius:   "9px",
    background:     bg,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "18px",
    flexShrink:     0,
  }),
  statNum:   { fontSize: "22px", fontWeight: 800, color: "#0f2744", lineHeight: 1 },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },

  card: {
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
    marginBottom: "12px",
    overflow:     "hidden",
  },
  cardHeader: {
    padding:        "12px 18px",
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    borderBottom:   "1px solid #f3f4f6",
  },
  cursoNombre: { fontSize: "14px", fontWeight: 700, color: "#0f2744" },

  pctBadge: (color) => ({
    fontSize:   "13px",
    fontWeight: 800,
    color,
    background: color === "#15803d" ? "#f0fdf4" : color === "#d97706" ? "#fffbeb" : "#fef2f2",
    border:     `1px solid ${color === "#15803d" ? "#bbf7d0" : color === "#d97706" ? "#fde68a" : "#fecaca"}`,
    borderRadius: "6px",
    padding:    "3px 10px",
  }),

  progTrack: {
    height:       "8px",
    background:   "#f1f5f9",
    margin:       "0 18px 12px",
    borderRadius: "4px",
    overflow:     "hidden",
  },
  progFill: (w, color) => ({
    height:       "100%",
    width:        `${w}%`,
    background:   color,
    borderRadius: "4px",
    transition:   "width 0.5s",
  }),

  miniStats: { display: "flex", gap: "12px", padding: "0 18px 12px", fontSize: "12px" },
  statPresente: { color: "#15803d", fontWeight: 600 },
  statAusente:  { color: "#dc2626", fontWeight: 600 },
  statTotal:    { color: "#6b7280" },

  registrosGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))",
    gap:                 "6px",
    padding:             "0 18px 16px",
  },
  registro: (presente) => ({
    padding:        "7px 10px",
    borderRadius:   "7px",
    background:     presente ? "#f0fdf4" : "#fef2f2",
    border:         `1px solid ${presente ? "#bbf7d0" : "#fecaca"}`,
    fontSize:       "11.5px",
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
  }),
  registroFecha:  { color: "#374151" },
  registroEstado: (presente) => ({ fontWeight: 700, color: presente ? "#15803d" : "#dc2626" }),

  empty: {
    textAlign:    "center",
    padding:      "50px 20px",
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
  },
};

// Verde >= 90%, ambar >= 75%, rojo < 75%
const colorPct = (p) => p >= 90 ? "#15803d" : p >= 75 ? "#d97706" : "#dc2626";

const AsistenciaEstudiante = () => {
  const { usuario } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [cursos,      setCursos]      = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [asi, cur] = await Promise.all([
        obtenerAsistenciaPorEstudiante(usuario.id),
        obtenerCursosPorEstudiante(usuario.id),
      ]);
      if (!asi?.error && Array.isArray(asi)) setAsistencias(asi);
      if (!cur?.error && Array.isArray(cur)) setCursos(cur);
    } catch (error) {
      console.error("[AsistenciaEstudiante]", error);
    } finally {
      setLoading(false);
    }
  };

  const getNombreCurso = (id) => {
    const curso = cursos.find((c) => c.id_curso === id);
    return curso ? curso.nombre : `Curso #${id}`;
  };

  const idsCursos    = [...new Set(asistencias.map((a) => a.id_curso))];
  const totalClases   = asistencias.length;
  const totalPresente = asistencias.filter((a) => a.estado).length;
  const totalAusente  = totalClases - totalPresente;
  const pctGeneral    = totalClases > 0 ? Math.round((totalPresente / totalClases) * 100) : 0;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <BannerPage
        icono="📅"
        titulo="Mi Asistencia"
        subtitulo={
          totalClases > 0
            ? `${totalClases} clase${totalClases !== 1 ? "s" : ""} registrada${totalClases !== 1 ? "s" : ""} · Asistencia general: ${pctGeneral}%`
            : "Sin registros de asistencia aún"
        }
      />

      {totalClases > 0 && (
        <div style={styles.statsRow}>
          <div style={styles.statCard("#1e40af")}>
            <div style={styles.statIcon("#eff6ff")}>📊</div>
            <div>
              <div style={styles.statNum}>{pctGeneral}%</div>
              <div style={styles.statLabel}>Asistencia General</div>
            </div>
          </div>
          <div style={styles.statCard("#15803d")}>
            <div style={styles.statIcon("#f0fdf4")}>✅</div>
            <div>
              <div style={styles.statNum}>{totalPresente}</div>
              <div style={styles.statLabel}>Clases Asistidas</div>
            </div>
          </div>
          <div style={styles.statCard("#dc2626")}>
            <div style={styles.statIcon("#fef2f2")}>❌</div>
            <div>
              <div style={styles.statNum}>{totalAusente}</div>
              <div style={styles.statLabel}>Clases Faltadas</div>
            </div>
          </div>
        </div>
      )}

      {idsCursos.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📅</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f2744", marginBottom: "6px" }}>
            Sin registros de asistencia
          </div>
          <div style={{ fontSize: "12.5px", color: "#6b7280" }}>
            El docente aún no ha registrado asistencia en tus cursos
          </div>
        </div>
      ) : (
        idsCursos.map((idCurso) => {
          const registros = asistencias.filter((a) => a.id_curso === idCurso);
          const pres      = registros.filter((r) => r.estado).length;
          const ause      = registros.length - pres;
          const pct       = registros.length > 0 ? Math.round((pres / registros.length) * 100) : 0;
          const col       = colorPct(pct);

          return (
            <div key={idCurso} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cursoNombre}>{getNombreCurso(idCurso)}</span>
                <span style={styles.pctBadge(col)}>{pct}%</span>
              </div>

              <div style={{ padding: "0 18px 4px" }}>
                <div style={styles.progTrack}>
                  <div style={styles.progFill(pct, col)} />
                </div>
              </div>

              <div style={styles.miniStats}>
                <span style={styles.statPresente}>✅ {pres} presentes</span>
                <span style={styles.statAusente}>❌ {ause} ausentes</span>
                <span style={styles.statTotal}>· {registros.length} clases totales</span>
              </div>

              <div style={styles.registrosGrid}>
                {registros
                  .slice()
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .map((r, i) => (
                    <div key={i} style={styles.registro(r.estado)}>
                      <span style={styles.registroFecha}>
                        {new Date(r.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      </span>
                      <span style={styles.registroEstado(r.estado)}>
                        {r.estado ? "P" : "A"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AsistenciaEstudiante;
