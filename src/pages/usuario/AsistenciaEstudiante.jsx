import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerAsistenciaPorEstudiante } from "../../services/asistenciaService";
import { obtenerCursosPorEstudiante } from "../../services/cursoService";

const AsistenciaEstudiante = () => {
  const { usuario } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [asi, cur] = await Promise.all([
        obtenerAsistenciaPorEstudiante(usuario.id),
        obtenerCursosPorEstudiante(usuario.id),
      ]);
      if (!asi.error && Array.isArray(asi)) setAsistencias(asi);
      if (!cur.error && Array.isArray(cur)) setCursos(cur);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getNombreCurso = (id) => {
    const c = cursos.find((x) => x.id_curso === id);
    return c ? c.nombre : `Curso #${id}`;
  };

  const calcularPorcentaje = (idCurso) => {
    const del = asistencias.filter((a) => a.id_curso === idCurso);
    if (!del.length) return 0;
    return Math.round((del.filter((a) => a.estado).length / del.length) * 100);
  };

  const porCurso = [...new Set(asistencias.map((a) => a.id_curso))];

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#667eea", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>✅ Mi Asistencia</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Revisa tu asistencia por curso</p>
      </div>

      {porCurso.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: 12, color: "#64748b" }}>
          <span style={{ fontSize: "3rem" }}>📅</span>
          <p style={{ fontWeight: 600 }}>No hay registros de asistencia aún</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {porCurso.map((idCurso) => {
            const registros = asistencias.filter((a) => a.id_curso === idCurso);
            const pct = calcularPorcentaje(idCurso);
            const color = pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444";

            return (
              <div key={idCurso} style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontWeight: 700, color: "#1e293b" }}>{getNombreCurso(idCurso)}</h3>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color }}>{pct}%</span>
                </div>

                <div style={{ height: 10, background: "#e2e8f0", borderRadius: 5, marginBottom: "1rem", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 5, transition: "width 0.5s ease" }} />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
                  <span style={{ color: "#10b981", fontWeight: 600 }}>✅ {registros.filter((r) => r.estado).length} presentes</span>
                  <span style={{ color: "#ef4444", fontWeight: 600 }}>❌ {registros.filter((r) => !r.estado).length} ausentes</span>
                  <span style={{ color: "#64748b" }}>📅 {registros.length} clases</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: "0.5rem" }}>
                  {registros.map((r, i) => (
                    <div key={i} style={{ padding: "0.5rem 0.75rem", borderRadius: 8, background: r.estado ? "#f0fdf4" : "#fff5f5", border: `1px solid ${r.estado ? "#10b981" : "#ef4444"}`, fontSize: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#475569" }}>{new Date(r.fecha).toLocaleDateString("es-ES")}</span>
                      <span>{r.estado ? "✅" : "❌"}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AsistenciaEstudiante;