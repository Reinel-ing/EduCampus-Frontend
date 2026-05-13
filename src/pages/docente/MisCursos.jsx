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
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error: {error}</p>
        <button onClick={cargarCursos} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Mis Cursos</h2>
          <p className={styles.subtitle}>
            {cursos.length}{" "}
            {cursos.length === 1 ? "curso asignado" : "cursos asignados"}
          </p>
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
  );
};

export default MisCursos;
