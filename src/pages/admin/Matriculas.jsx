import React, { useState, useEffect } from "react";
import { listarInscripciones } from "../../services/inscripcionService";
import { listarCursos } from "../../services/cursoService";
import { listarEstudiantes } from "../../services/estudianteService";

const Matriculas = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ins, cur, est] = await Promise.all([
        listarInscripciones(),
        listarCursos(),
        listarEstudiantes(),
      ]);
      if (!ins.error) setInscripciones(Array.isArray(ins) ? ins : []);
      if (!cur.error) setCursos(Array.isArray(cur) ? cur : []);
      if (!est.error) setEstudiantes(Array.isArray(est) ? est : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getNombreEstudiante = (id) => {
    const e = estudiantes.find((x) => x.id_estudiante === id);
    return e ? `${e.nombres} ${e.apellidos}` : "—";
  };

  const getNombreCurso = (id) => {
    const c = cursos.find((x) => x.id_curso === id);
    return c ? c.nombre : "—";
  };

  const filtradas = inscripciones.filter((ins) => {
    const nom = getNombreEstudiante(ins.id_estudiante).toLowerCase();
    const cur = getNombreCurso(ins.id_curso).toLowerCase();
    return nom.includes(searchTerm.toLowerCase()) || cur.includes(searchTerm.toLowerCase());
  });

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  return (
    <div style={{ padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" }}>
      {/* Banner institucional */}
      <div style={{ background: "linear-gradient(135deg,#0f2744 0%,#1e40af 100%)", borderRadius: "12px", padding: "18px 24px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", marginBottom: "3px" }}>Matrículas</div>
          <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,.6)" }}>{inscripciones.length} {inscripciones.length === 1 ? "inscripción registrada" : "inscripciones registradas"}</div>
        </div>
        <div style={{ fontSize: "36px", opacity: 0.7 }}>📋</div>
      </div>
      <div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "14px" }}>
        {[
          { label: "Total Matrículas", value: inscripciones.length, icon: "📋", color: "#1e40af", bg: "#eff6ff" },
          { label: "Cursos", value: cursos.length, icon: "📚", color: "#15803d", bg: "#f0fdf4" },
          { label: "Estudiantes", value: estudiantes.length, icon: "👥", color: "#d97706", bg: "#fffbeb" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: "10px", padding: "15px 17px", border: "1px solid #dde3ec", borderLeft: `4px solid ${s.color}`, display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f2744", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div style={{ background: "white", borderRadius: 12, padding: "1rem 1.5rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <input
          type="text"
          placeholder="🔍 Buscar por estudiante o curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box" }}
        />
      </div>

      {/* Tabla */}
      <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)" }}>
              {["#", "Estudiante", "Curso", "ID Inscripción"].map((h) => (
                <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "white", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>No se encontraron matrículas</td></tr>
            ) : (
              filtradas.map((ins, i) => (
                <tr key={ins.id_inscripcion} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                  <td style={{ padding: "1rem 1.5rem", color: "#64748b" }}>{i + 1}</td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "#1e293b" }}>{getNombreEstudiante(ins.id_estudiante)}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "#475569" }}>{getNombreCurso(ins.id_curso)}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "#64748b" }}>#{ins.id_inscripcion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Matriculas;