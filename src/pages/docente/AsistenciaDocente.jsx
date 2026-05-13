import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerCursosPorDocente } from "../../services/cursoService";
import { obtenerEstudiantesConDetallesPorCurso } from "../../services/inscripcionService";
import { registrarAsistencia, obtenerAsistenciaPorCurso } from "../../services/asistenciaService";

const AsistenciaDocente = () => {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [guardando, setGuardando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  useEffect(() => {
    if (cursoSeleccionado) cargarEstudiantes();
  }, [cursoSeleccionado]);

  const cargarCursos = async () => {
    const data = await obtenerCursosPorDocente(usuario.id);
    if (!data.error && Array.isArray(data)) setCursos(data);
  };

  const cargarEstudiantes = async () => {
    setLoading(true);
    const data = await obtenerEstudiantesConDetallesPorCurso(cursoSeleccionado);
    if (!data.error && Array.isArray(data)) {
      setEstudiantes(data);
      const ini = {};
      data.forEach((e) => { ini[e.id_estudiante] = true; });
      setAsistencias(ini);
    }
    setLoading(false);
  };

  const toggle = (id) => setAsistencias((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      await Promise.all(
        estudiantes.map((e) =>
          registrarAsistencia({ id_estudiante: e.id_estudiante, id_curso: parseInt(cursoSeleccionado), fecha, estado: asistencias[e.id_estudiante] })
        )
      );
      setMensaje({ tipo: "ok", texto: "✅ Asistencia registrada correctamente" });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({ tipo: "err", texto: "❌ Error al guardar asistencia" });
    } finally {
      setGuardando(false);
    }
  };

  const presentes = Object.values(asistencias).filter(Boolean).length;
  const ausentes = estudiantes.length - presentes;

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>✅ Registro de Asistencia</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Registra la asistencia de tus estudiantes</p>
      </div>

      {mensaje && (
        <div style={{ padding: "1rem 1.5rem", borderRadius: 8, marginBottom: "1rem", background: mensaje.tipo === "ok" ? "#d1fae5" : "#fee2e2", color: mensaje.tipo === "ok" ? "#065f46" : "#991b1b", fontWeight: 600 }}>
          {mensaje.texto}
        </div>
      )}

      {/* Selectores */}
      <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#475569", marginBottom: "0.5rem" }}>Curso</label>
          <select value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem" }}>
            <option value="">-- Seleccionar curso --</option>
            {cursos.map((c) => <option key={c.id_curso} value={c.id_curso}>{c.nombre}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#475569", marginBottom: "0.5rem" }}>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Stats */}
      {cursoSeleccionado && estudiantes.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            {[{ label: "Total", value: estudiantes.length, color: "#667eea", icon: "👥" },
              { label: "Presentes", value: presentes, color: "#10b981", icon: "✅" },
              { label: "Ausentes", value: ausentes, color: "#ef4444", icon: "❌" }
            ].map((s, i) => (
              <div key={i} style={{ background: "white", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <div style={{ fontSize: "2rem" }}>{s.icon}</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Lista */}
          <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
            {estudiantes.map((est, i) => (
              <div key={est.id_estudiante} onClick={() => toggle(est.id_estudiante)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: i < estudiantes.length - 1 ? "1px solid #e2e8f0" : "none", cursor: "pointer", background: asistencias[est.id_estudiante] ? "#f0fdf4" : "#fff5f5", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {(est.nombres || "?")[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>{est.nombres} {est.apellidos}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>CI: {est.cedula}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: asistencias[est.id_estudiante] ? "#10b981" : "#ef4444" }}>
                    {asistencias[est.id_estudiante] ? "Presente" : "Ausente"}
                  </span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: asistencias[est.id_estudiante] ? "#10b981" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.1rem" }}>
                    {asistencias[est.id_estudiante] ? "✓" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleGuardar} disabled={guardando}
            style={{ padding: "0.875rem 2rem", background: "linear-gradient(135deg,#10b981,#059669)", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
            {guardando ? "Guardando..." : "💾 Guardar Asistencia"}
          </button>
        </>
      )}

      {cursoSeleccionado && !loading && estudiantes.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: 12, color: "#64748b" }}>
          <span style={{ fontSize: "3rem" }}>👥</span>
          <p style={{ fontWeight: 600 }}>No hay estudiantes inscritos en este curso</p>
        </div>
      )}
    </div>
  );
};

export default AsistenciaDocente;