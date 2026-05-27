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
    <div style={{ padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#0f2744 0%,#1e40af 100%)", borderRadius: "12px", padding: "18px 24px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", marginBottom: "3px" }}>Registro de Asistencia</div>
          <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,.6)" }}>Registra la asistencia de tus estudiantes por curso y fecha</div>
        </div>
        <div style={{ fontSize: "36px", opacity: 0.7 }}>📅</div>
      </div>

      {mensaje && (
        <div style={{ padding: "1rem 1.5rem", borderRadius: 8, marginBottom: "1rem", background: mensaje.tipo === "ok" ? "#d1fae5" : "#fee2e2", color: mensaje.tipo === "ok" ? "#065f46" : "#991b1b", fontWeight: 600 }}>
          {mensaje.texto}
        </div>
      )}

      {/* Selectores */}
      <div style={{ background: "white", borderRadius: "10px", padding: "1.25rem 1.5rem", marginBottom: "14px", border: "1px solid #dde3ec", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
            {[{ label: "Total", value: estudiantes.length, color: "#1e40af", icon: "👥" },
              { label: "Presentes", value: presentes, color: "#10b981", icon: "✅" },
              { label: "Ausentes", value: ausentes, color: "#ef4444", icon: "❌" }
            ].map((s, i) => (
              <div key={i} style={{ background: "white", borderRadius: "10px", padding: "15px 17px", border: "1px solid #dde3ec", borderLeft: `4px solid ${s.color}`, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: s.color === "#1e40af" ? "#eff6ff" : s.color === "#10b981" ? "#f0fdf4" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f2744", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Lista */}
          <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", border: "1px solid #dde3ec", marginBottom: "14px" }}>
            {estudiantes.map((est, i) => (
              <div key={est.id_estudiante} onClick={() => toggle(est.id_estudiante)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: i < estudiantes.length - 1 ? "1px solid #e2e8f0" : "none", cursor: "pointer", background: asistencias[est.id_estudiante] ? "#f0fdf4" : "#fff5f5", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#1e40af,#1e3a8a)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
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
            style={{ padding: "10px 24px", background: "linear-gradient(135deg,#0f2744,#1e40af)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
            {guardando ? "Guardando..." : "💾 Guardar Asistencia"}
          </button>
        </>
      )}

      {cursoSeleccionado && !loading && estudiantes.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "10px", border: "1px solid #dde3ec", color: "#6b7280" }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👥</div>
          <div style={{ fontWeight: 700, color: "#0f2744" }}>No hay estudiantes inscritos en este curso</div>
        </div>
      )}
    </div>
  );
};

export default AsistenciaDocente;