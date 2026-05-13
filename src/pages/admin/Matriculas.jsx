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
      <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#667eea", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>📋 Matrículas</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Listado de estudiantes inscritos por curso</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Matrículas", value: inscripciones.length, icon: "📋" },
          { label: "Cursos", value: cursos.length, icon: "📚" },
          { label: "Estudiantes", value: estudiantes.length, icon: "👥" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>{s.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#667eea" }}>{s.value}</p>
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
            <tr style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
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
  );
};

export default Matriculas;