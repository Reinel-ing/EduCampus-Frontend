import React, { useState, useEffect } from "react";
import { obtenerCursosPorDocente } from "../../services/cursoService";
import { useAuth } from "../../context/AuthContext";
import { Curso } from "../../models/Curso";
import CursoCardDocente from "../../components/docente/CursoCardDocente";
import CursoDetalles from "../../components/administrador/CursoDetalles";
import styles from "../../styles/GestionCursos.module.css";

const MisCursos = () => {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detallesOpen, setDetallesOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, [usuario]);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      if (!usuario?.id) {
        throw new Error("No se encontró el ID del docente");
      }

      const cursosData = await obtenerCursosPorDocente(usuario.id);

      if (cursosData.error) {
        setError(cursosData.message);
      } else {
        const cursosArray = cursosData.map((c) => new Curso(c));
        setCursos(cursosArray);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = (curso) => {
    setCursoSeleccionado(curso);
    setDetallesOpen(true);
  };

  if (loading) {
    return (
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"400px" }}>
        <div style={{ width:40, height:40, border:"4px solid #e2e8f0", borderTopColor:"#1e40af", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding:"3rem", textAlign:"center", color:"#dc2626" }}>
        <p>Error: {error}</p>
        <button onClick={cargarCursos} style={{ marginTop:"1rem", padding:"8px 20px", background:"#1e40af", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:600 }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding:"22px 24px", background:"#f0f4f8", minHeight:"100%", boxSizing:"border-box" }}>
      {/* Banner institucional */}
      <div style={{ background:"linear-gradient(135deg,#0f2744 0%,#1e40af 100%)", borderRadius:"12px", padding:"18px 24px", marginBottom:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:"17px", fontWeight:800, color:"#fff", marginBottom:"3px" }}>Mis Cursos</div>
          <div style={{ fontSize:"12.5px", color:"rgba(255,255,255,.6)" }}>{cursos.length} {cursos.length === 1 ? "curso asignado" : "cursos asignados"}</div>
        </div>
        <div style={{ fontSize:"36px", opacity:0.7 }}>📚</div>
      </div>
      <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div style={{ display:"none" }}></div>
        </div>
      </div>

      {cursos.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No tienes cursos asignados</h3>
          <p>Actualmente no tienes ningún curso bajo tu responsabilidad.</p>
        </div>
      ) : (
        <div className={styles.cursosGrid}>
          {cursos.map((curso) => (
            <CursoCardDocente
              key={curso.id_curso}
              curso={curso}
              onVerDetalles={handleVerDetalles}
            />
          ))}
        </div>
      )}

      {detallesOpen && (
        <CursoDetalles
          curso={cursoSeleccionado}
          usuarioActual={usuario}
          onClose={() => {
            setDetallesOpen(false);
            setCursoSeleccionado(null);
          }}
        />
      )}
    </div>
    </div>
  );
};

export default MisCursos;
