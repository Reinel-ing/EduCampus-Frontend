import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerCursosPorDocente } from "../../services/cursoService";
import { obtenerEstudiantesCurso } from "../../services/cursoService";
import { obtenerEstudiantePorId } from "../../services/estudianteService";
import {
  obtenerCalificacionesPorCurso,
  crearCalificacion,
  actualizarCalificacion,
} from "../../services/calificacionService";
import styles from "../../styles/Calificaciones.module.css";

const Calificaciones = () => {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    tipo_evaluacion: 1,
    nota: "",
  });

  useEffect(() => {
    cargarCursos();
  }, []);

  useEffect(() => {
    if (cursoSeleccionado) {
      cargarEstudiantesYCalificaciones();
    }
  }, [cursoSeleccionado]);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const data = await obtenerCursosPorDocente(usuario.id);
      if (!data.error && Array.isArray(data)) {
        setCursos(data);
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantesYCalificaciones = async () => {
    try {
      setLoading(true);

      // Obtener IDs de estudiantes
      const estudiantesIds = await obtenerEstudiantesCurso(cursoSeleccionado);

      if (!estudiantesIds.error && Array.isArray(estudiantesIds)) {
        // Obtener información completa de cada estudiante
        const estudiantesPromises = estudiantesIds.map((id) =>
          obtenerEstudiantePorId(id)
        );
        const estudiantesData = await Promise.all(estudiantesPromises);
        const estudiantesValidos = estudiantesData.filter((e) => !e.error);
        setEstudiantes(estudiantesValidos);
      }

      // Obtener calificaciones del curso
      const califs = await obtenerCalificacionesPorCurso(cursoSeleccionado);
      if (!califs.error && Array.isArray(califs)) {
        setCalificaciones(califs);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerCalificacionesEstudiante = (estudianteId) => {
    return calificaciones.filter((c) => c.id_estudiante === estudianteId);
  };

  const calcularPromedio = (califs) => {
    if (califs.length === 0) return "-";

    const parcial1 = califs.find((c) => c.tipo_evaluacion === 1);
    const parcial2 = califs.find((c) => c.tipo_evaluacion === 2);
    const final = califs.find((c) => c.tipo_evaluacion === 3);

    if (!parcial1 && !parcial2 && !final) return "-";

    const p1 = parcial1 ? Number(parcial1.nota) * 0.3 : 0;
    const p2 = parcial2 ? Number(parcial2.nota) * 0.3 : 0;
    const f  = final    ? Number(final.nota)    * 0.4 : 0;

    return (p1 + p2 + f).toFixed(2); // escala 0-5
  };

  const obtenerProximaEvaluacion = (califs) => {
    const tipos = califs.map((c) => c.tipo_evaluacion);
    if (!tipos.includes(1)) return 1;
    if (!tipos.includes(2)) return 2;
    if (!tipos.includes(3)) return 3;
    return null;
  };

  const abrirModalAgregar = (estudiante) => {
    const califs = obtenerCalificacionesEstudiante(estudiante.id_estudiante);
    const proximaEval = obtenerProximaEvaluacion(califs);

    if (proximaEval === null) {
      alert("Este estudiante ya tiene todas las calificaciones registradas");
      return;
    }

    setEstudianteSeleccionado(estudiante);
    setFormData({
      tipo_evaluacion: proximaEval,
      nota: "",
    });
    setMostrarModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nota = parseFloat(formData.nota);
    if (isNaN(nota) || nota < 0 || nota > 5) {
      alert("La nota debe estar entre 0.0 y 5.0");
      return;
    }

    const datos = {
      id_estudiante: estudianteSeleccionado.id_estudiante,
      id_curso: parseInt(cursoSeleccionado),
      tipo_evaluacion: formData.tipo_evaluacion,
      nota: nota,
    };

    const resultado = await crearCalificacion(datos);

    if (!resultado.error) {
      alert("Calificación registrada exitosamente");
      setMostrarModal(false);
      cargarEstudiantesYCalificaciones();
    } else {
      alert("Error al registrar calificación: " + resultado.message);
    }
  };

  const handleEditarCalificacion = async (calificacion, nuevaNota) => {
    const nota = parseFloat(nuevaNota);
    if (isNaN(nota) || nota < 0 || nota > 5) {
      alert("La nota debe estar entre 0.0 y 5.0");
      return;
    }

    const resultado = await actualizarCalificacion(
      calificacion.id_calificacion,
      {
        nota: nota,
      }
    );

    if (!resultado.error) {
      alert("Calificación actualizada exitosamente");
      cargarEstudiantesYCalificaciones();
    } else {
      alert("Error al actualizar calificación: " + resultado.message);
    }
  };

  const getTipoEvaluacionNombre = (tipo) => {
    switch (tipo) {
      case 1:
        return "Parcial 1";
      case 2:
        return "Parcial 2";
      case 3:
        return "Final";
      default:
        return "Desconocido";
    }
  };

  if (loading) {
    return (
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"400px" }}>
        <div style={{ width:40, height:40, border:"4px solid #e2e8f0", borderTopColor:"#1e40af", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding:"22px 24px", background:"#f0f4f8", minHeight:"100%", boxSizing:"border-box" }}>
      {/* Banner institucional */}
      <div style={{ background:"linear-gradient(135deg,#0f2744 0%,#1e40af 100%)", borderRadius:"12px", padding:"18px 24px", marginBottom:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:"17px", fontWeight:800, color:"#fff", marginBottom:"3px" }}>Registro de Calificaciones</div>
          <div style={{ fontSize:"12.5px", color:"rgba(255,255,255,.6)" }}>Gestiona las calificaciones de tus estudiantes</div>
        </div>
        <div style={{ fontSize:"36px", opacity:0.7 }}>📝</div>
      </div>
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={{ display:"none" }}>
        <h1 className={styles.title}>Registro de Calificaciones</h1>
        <p className={styles.subtitle}>
          Gestiona las calificaciones de tus estudiantes
        </p>
      </div>

      {/* Selector de curso */}
      <div className={styles.selectorContainer}>
        <label className={styles.selectorLabel}>Seleccionar Curso:</label>
        <select
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
          className={styles.selectorCurso}
        >
          <option value="">-- Seleccione un curso --</option>
          {cursos.map((curso) => (
            <option key={curso.id_curso} value={curso.id_curso}>
              {curso.nombre}
            </option>
          ))}
        </select>
      </div>

      {cursoSeleccionado && estudiantes.length > 0 && (
        <>
          <button
            className={styles.btnAgregar}
            onClick={() => {
              if (estudiantes.length === 0) {
                alert("No hay estudiantes en este curso");
                return;
              }
              // Mostrar el primer estudiante que no tenga todas las calificaciones
              const estudianteSinCompletarCalif = estudiantes.find((est) => {
                const califs = obtenerCalificacionesEstudiante(
                  est.id_estudiante
                );
                return obtenerProximaEvaluacion(califs) !== null;
              });

              if (estudianteSinCompletarCalif) {
                abrirModalAgregar(estudianteSinCompletarCalif);
              } else {
                alert(
                  "Todos los estudiantes tienen las calificaciones completas"
                );
              }
            }}
          >
            + Agregar Calificación
          </button>

          {/* Tabla de calificaciones */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>ESTUDIANTE</th>
                  <th className={styles.tableHeader}>PARCIAL 1</th>
                  <th className={styles.tableHeader}>PARCIAL 2</th>
                  <th className={styles.tableHeader}>FINAL</th>
                  <th className={styles.tableHeader}>PROMEDIO</th>
                  <th className={styles.tableHeader}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante) => {
                  const califs = obtenerCalificacionesEstudiante(
                    estudiante.id_estudiante
                  );
                  const parcial1 = califs.find((c) => c.tipo_evaluacion === 1);
                  const parcial2 = califs.find((c) => c.tipo_evaluacion === 2);
                  const final = califs.find((c) => c.tipo_evaluacion === 3);
                  const promedio = calcularPromedio(califs);

                  return (
                    <tr
                      key={estudiante.id_estudiante}
                      className={styles.tableRow}
                    >
                      <td className={styles.tableCell}>
                        {estudiante.nombres} {estudiante.apellidos}
                      </td>
                      <td className={styles.tableCell}>
                        {parcial1 ? Number(parcial1.nota).toFixed(1) : "-"}
                      </td>
                      <td className={styles.tableCell}>
                        {parcial2 ? Number(parcial2.nota).toFixed(1) : "-"}
                      </td>
                      <td className={styles.tableCell}>
                        {final ? Number(final.nota).toFixed(1) : "-"}
                      </td>
                      <td className={styles.tableCell}>
                        <span className={styles.promedioBadge}>{promedio}</span>
                      </td>
                      <td className={styles.tableCell}>
                        {obtenerProximaEvaluacion(califs) !== null && (
                          <button
                            className={styles.btnAccion}
                            onClick={() => abrirModalAgregar(estudiante)}
                          >
                            + Agregar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {cursoSeleccionado && estudiantes.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📝</span>
          <p className={styles.emptyText}>
            No hay estudiantes inscritos en este curso
          </p>
        </div>
      )}

      {/* Modal para agregar calificación */}
      {mostrarModal && estudianteSeleccionado && (
        <div
          className={styles.modalOverlay}
          onClick={() => setMostrarModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Agregar Calificación</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Estudiante:</label>
                <input
                  type="text"
                  value={`${estudianteSeleccionado.nombres} ${estudianteSeleccionado.apellidos}`}
                  disabled
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Evaluación:</label>
                <input
                  type="text"
                  value={getTipoEvaluacionNombre(formData.tipo_evaluacion)}
                  disabled
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nota (0.0 - 5.0):</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.nota}
                  onChange={(e) =>
                    setFormData({ ...formData, nota: e.target.value })
                  }
                  required
                  className={styles.formInput}
                  placeholder="Ingrese la nota"
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnCancelar}
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnGuardar}>
                  Guardar Calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Calificaciones;
