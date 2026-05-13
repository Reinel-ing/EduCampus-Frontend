import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { listarCursos } from "../../services/cursoService";
import { obtenerMaterialPorCurso } from "../../services/materialService";
import {
  obtenerCursosPorEstudiante,
  inscribirEstudiante,
  verificarInscripcion,
} from "../../services/inscripcionService";
import styles from "../../styles/MisCursosEstudiante.module.css";

const MisCursos = () => {
  const { usuario } = useAuth();
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMaterial, setModalMaterial] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [activeTab, setActiveTab] = useState("inscritos");
  const [inscribiendo, setInscribiendo] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, [usuario]);

  const cargarCursos = async () => {
    try {
      setLoading(true);

      // Obtener IDs de cursos inscritos
      const idsInscritos = await obtenerCursosPorEstudiante(usuario.id);

      // Obtener todos los cursos
      const todosCursos = await listarCursos();

      if (!todosCursos.error && Array.isArray(todosCursos)) {
        // Filtrar cursos inscritos
        const inscritos = todosCursos.filter(
          (curso) => idsInscritos.includes(curso.id_curso) && curso.estado
        );
        setCursosInscritos(inscritos);

        // Filtrar cursos disponibles (no inscritos y activos)
        const disponibles = todosCursos.filter(
          (curso) => !idsInscritos.includes(curso.id_curso) && curso.estado
        );
        setCursosDisponibles(disponibles);
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInscribir = async (curso) => {
    if (!confirm(`¿Desea inscribirse en el curso "${curso.nombre}"?`)) {
      return;
    }

    try {
      setInscribiendo(curso.id_curso);
      const resultado = await inscribirEstudiante(usuario.id, curso.id_curso);

      if (resultado.error) {
        alert("Error: " + resultado.message);
      } else {
        alert(
          "✅ Inscripción exitosa. Se ha enviado un email de confirmación."
        );
        await cargarCursos();
        setActiveTab("inscritos");
      }
    } catch (error) {
      console.error("Error al inscribir:", error);
      alert("Error al procesar la inscripción");
    } finally {
      setInscribiendo(null);
    }
  };

  const handleVerContenido = async (curso) => {
    setModalMaterial(curso);
    setLoadingMaterial(true);
    setMateriales([]);

    try {
      const data = await obtenerMaterialPorCurso(curso.id_curso);
      if (!data.error && Array.isArray(data)) {
        setMateriales(data);
      }
    } catch (error) {
      console.error("Error al cargar material:", error);
    } finally {
      setLoadingMaterial(false);
    }
  };

  const handleDescargar = (material) => {
    // Crear un enlace temporal para forzar la descarga con nombre
    const link = document.createElement("a");
    link.href = material.archivo_url;

    // Asegurar que el nombre tenga extensión .pdf
    let nombreArchivo = material.nombre_archivo;
    if (!nombreArchivo.toLowerCase().endsWith(".pdf")) {
      nombreArchivo += ".pdf";
    }

    link.download = nombreArchivo;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatearHorario = (horario) => {
    if (!horario || !Array.isArray(horario)) return "No especificado";
    return horario.map((h) => `${h.dia}: ${h.hora}`).join(" | ");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Cursos</h1>
        <p className={styles.subtitle}>
          Explora el contenido de tus cursos o inscríbete en nuevos
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "inscritos" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("inscritos")}
        >
          📚 Mis Cursos ({cursosInscritos.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "disponibles" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("disponibles")}
        >
          ➕ Cursos Disponibles ({cursosDisponibles.length})
        </button>
      </div>

      {/* Contenido de Cursos Inscritos */}
      {activeTab === "inscritos" && (
        <>
          {cursosInscritos.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📚</span>
              <p className={styles.emptyText}>No tienes cursos inscritos</p>
              <button
                className={styles.btnVerDisponibles}
                onClick={() => setActiveTab("disponibles")}
              >
                Ver Cursos Disponibles
              </button>
            </div>
          ) : (
            <div className={styles.cursosGrid}>
              {cursosInscritos.map((curso) => (
                <div key={curso.id_curso} className={styles.cursoCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cursoNombre}>{curso.nombre}</h3>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Profesor:</span>
                      <span className={styles.infoValue}>
                        {curso.docente
                          ? `${curso.docente.nombres} ${curso.docente.apellidos}`
                          : "No asignado"}
                      </span>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Especialidad:</span>
                      <span className={styles.infoValue}>
                        {curso.docente?.especialidad || "No especificada"}
                      </span>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Horario:</span>
                      <span className={styles.infoValue}>
                        {formatearHorario(curso.horario)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={styles.btnVerContenido}
                      onClick={() => handleVerContenido(curso)}
                    >
                      Ver Contenido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Contenido de Cursos Disponibles */}
      {activeTab === "disponibles" && (
        <>
          {cursosDisponibles.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>✅</span>
              <p className={styles.emptyText}>
                No hay cursos disponibles para inscribirse
              </p>
            </div>
          ) : (
            <div className={styles.cursosGrid}>
              {cursosDisponibles.map((curso) => (
                <div
                  key={curso.id_curso}
                  className={`${styles.cursoCard} ${styles.cursoDisponible}`}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cursoNombre}>{curso.nombre}</h3>
                    {curso.cupo_estudiante && (
                      <span className={styles.badgeCupo}>
                        Cupo: {curso.cupo_estudiante}
                      </span>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    {curso.descripcion && (
                      <p className={styles.cursoDescripcion}>
                        {curso.descripcion}
                      </p>
                    )}

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Horario:</span>
                      <span className={styles.infoValue}>
                        {formatearHorario(curso.horario)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={styles.btnInscribir}
                      onClick={() => handleInscribir(curso)}
                      disabled={inscribiendo === curso.id_curso}
                    >
                      {inscribiendo === curso.id_curso
                        ? "Inscribiendo..."
                        : "➕ Inscribirse"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Material Didáctico */}
      {modalMaterial && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalMaterial(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Material: {modalMaterial.nombre}
              </h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setModalMaterial(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {loadingMaterial ? (
                <div className={styles.modalLoading}>
                  <div className={styles.spinner}></div>
                  <p>Cargando material...</p>
                </div>
              ) : materiales.length === 0 ? (
                <div className={styles.emptyMaterial}>
                  <span className={styles.emptyIcon}>📄</span>
                  <p>No hay material disponible para este curso</p>
                </div>
              ) : (
                <div className={styles.materialesLista}>
                  {materiales.map((material) => (
                    <div
                      key={material.id_material}
                      className={styles.materialItem}
                    >
                      <div className={styles.materialIcon}>📄</div>
                      <div className={styles.materialInfo}>
                        <h4 className={styles.materialNombre}>
                          {material.nombre_archivo}
                        </h4>
                        <p className={styles.materialFecha}>
                          Subido:{" "}
                          {new Date(material.fecha).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        className={styles.btnDescargar}
                        onClick={() => handleDescargar(material)}
                      >
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCursos;
