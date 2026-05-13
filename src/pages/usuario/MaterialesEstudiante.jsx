import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerCursosPorEstudiante } from "../../services/cursoService";
import { obtenerMaterialPorCurso } from "../../services/materialService";

const MaterialesEstudiante = () => {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const cursosData = await obtenerCursosPorEstudiante(usuario.id);
      if (!cursosData.error && Array.isArray(cursosData)) {
        setCursos(cursosData);
        const todos = await Promise.all(
          cursosData.map((c) => obtenerMaterialPorCurso(c.id_curso))
        );
        const flat = todos.flatMap((m, i) =>
          Array.isArray(m) && !m.error
            ? m.map((item) => ({ ...item, nombre_curso: cursosData[i].nombre }))
            : []
        );
        setMateriales(flat);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = (material) => {
    const link = document.createElement("a");
    link.href = material.archivo_url;
    let nombre = material.nombre_archivo;
    if (!nombre.toLowerCase().endsWith(".pdf")) nombre += ".pdf";
    link.download = nombre;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtrados = materiales.filter(
    (m) =>
      m.nombre_archivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nombre_curso?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#667eea", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>📁 Mis Materiales</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Recursos disponibles en tus cursos</p>
      </div>

      <div style={{ background: "white", borderRadius: 12, padding: "1rem 1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <input type="text" placeholder="🔍 Buscar material o curso..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box" }} />
      </div>

      {filtrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: 12, color: "#64748b" }}>
          <span style={{ fontSize: "3rem" }}>📁</span>
          <p style={{ fontWeight: 600 }}>No hay materiales disponibles</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1rem" }}>
          {filtrados.map((m) => (
            <div key={m.id_material} style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ fontSize: "2.5rem", textAlign: "center" }}>📄</div>
              <h3 style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: "1rem", textAlign: "center" }}>{m.nombre_archivo}</h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#667eea", fontWeight: 600, textAlign: "center" }}>{m.nombre_curso}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
                {m.fecha ? new Date(m.fecha).toLocaleDateString("es-ES") : ""}
              </p>
              <button onClick={() => handleDescargar(m)}
                style={{ padding: "0.75rem", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                📥 Descargar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialesEstudiante;