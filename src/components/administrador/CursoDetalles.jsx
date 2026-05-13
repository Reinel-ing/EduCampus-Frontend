import React, { useState, useEffect } from "react";
import { obtenerCursoPorId } from "../../services/cursoService";
import { listarEstudiantes } from "../../services/estudianteService";
import {
  obtenerEstudiantesConDetallesPorCurso,
  inscribirEstudiante,
  eliminarInscripcion,
} from "../../services/inscripcionService";
import RegistroAsistencia from "../docente/RegistroAsistencia";
import styles from "../../styles/CursoDetalles.module.css";

const CursoDetalles = ({
  curso: cursoProp,
  cursoId,
  docentes,
  usuarioActual,
  onClose,
}) => {
  const [curso, setCurso] = useState(cursoProp || null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [mostrarAsistencia, setMostrarAsistencia] = useState(false);
  const [mostrarModalInscribir, setMostrarModalInscribir] = useState(false);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDetalles();
  }, [cursoId, cursoProp]);

  const cargarDetalles = async () => {
    try {
      setLoading(true);

      // Si ya tenemos el curso como prop, solo obtener estudiantes
      let cursoData = cursoProp;

      // Si no, obtener datos del curso por ID
      if (!cursoData && cursoId) {
        cursoData = await obtenerCursoPorId(cursoId);
      }

      if (cursoData && !cursoData.error) {
        setCurso(cursoData);

        // Usar el ID del curso (ya sea de prop o del fetch)
        const idCurso = cursoData.id_curso || cursoId;

        // Obtener estudiantes inscritos con detalles usando el nuevo endpoint
        const estudiantesData = await obtenerEstudiantesConDetallesPorCurso(
          idCurso
        );

        if (!estudiantesData.error && Array.isArray(estudiantesData)) {
          setEstudiantes(estudiantesData);
        } else {
          setEstudiantes([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantesDisponibles = async () => {
    try {
      const todosEstudiantes = await listarEstudiantes();

      if (!todosEstudiantes.error && Array.isArray(todosEstudiantes)) {
        // Filtrar estudiantes que no están inscritos
        const idsInscritos = estudiantes.map((e) => e.id_estudiante);
        const disponibles = todosEstudiantes.filter(
          (e) => !idsInscritos.includes(e.id_estudiante) && e.estado
        );
        setEstudiantesDisponibles(disponibles);
      }
    } catch (error) {
      console.error("Error al cargar estudiantes disponibles:", error);
    }
  };

  const handleAbrirModalInscribir = async () => {
    await cargarEstudiantesDisponibles();
    setMostrarModalInscribir(true);
  };

  const handleInscribirEstudiante = async () => {
    if (!estudianteSeleccionado) {
      alert("Por favor seleccione un estudiante");
      return;
    }

    if (estudiantes.length >= curso.cupo_estudiante) {
      alert("El curso ha alcanzado su cupo máximo");
      return;
    }

    try {
      setProcesando(true);
      const resultado = await inscribirEstudiante(
        parseInt(estudianteSeleccionado),
        curso.id_curso
      );

      if (resultado.error) {
        alert("Error: " + resultado.message);
      } else {
        alert(
          "✅ Estudiante inscrito exitosamente. Se ha enviado un email de confirmación."
        );
        setMostrarModalInscribir(false);
        setEstudianteSeleccionado("");
        await cargarDetalles();
      }
    } catch (error) {
      console.error("Error al inscribir:", error);
      alert("Error al inscribir estudiante");
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarInscripcion = async (idInscripcion, nombreEstudiante) => {
    if (!confirm(`¿Está seguro de eliminar a ${nombreEstudiante} del curso?`)) {
      return;
    }

    try {
      const resultado = await eliminarInscripcion(idInscripcion);

      if (resultado.error) {
        alert("Error: " + resultado.message);
      } else {
        alert("✅ Estudiante removido del curso exitosamente");
        await cargarDetalles();
      }
    } catch (error) {
      console.error("Error al eliminar inscripción:", error);
      alert("Error al eliminar inscripción");
    }
  };

  const getDocente = () => {
    // Si hay lista de docentes, buscar en ella
    if (docentes && docentes.length > 0) {
      return docentes.find((d) => d.id_docente === curso?.id_docente);
    }

    // Si no hay lista de docentes pero hay usuario actual con rol docente
    if (usuarioActual && usuarioActual.rol === "docente") {
      return {
        id_docente: usuarioActual.id,
        nombres: usuarioActual.nombres,
        apellidos: usuarioActual.apellidos,
        especialidad: usuarioActual.especialidad || "Docente",
        cedula: usuarioActual.cedula || "N/A",
        correo: usuarioActual.correo || "N/A",
      };
    }

    return null;
  };

  const calcularPorcentajeOcupacion = () => {
    if (!curso) return 0;
    return Math.round((estudiantes.length / curso.cupo_estudiante) * 100);
  };

  const getCuposDisponibles = () => {
    if (!curso) return 0;
    return curso.cupo_estudiante - estudiantes.length;
  };

  const getDiasSemana = () => {
    if (!curso?.horario) return [];
    const dias = curso.horario.map((h) => {
      if (typeof h === "object" && h.dia) {
        return h.dia;
      }
      return h.split(" ")[0];
    });
    return [...new Set(dias)];
  };

  const verificarHorarioActual = () => {
    if (!curso?.horario || !usuarioActual || usuarioActual.rol !== "docente") {
      return false;
    }

    const ahora = new Date();
    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const diaActual = diasSemana[ahora.getDay()];
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();

    for (const horario of curso.horario) {
      let dia, horaInicio, horaFin;

      if (typeof horario === "object" && horario.dia && horario.hora) {
        dia = horario.dia;
        const [inicio, fin] = horario.hora.split("-");
        horaInicio = inicio;
        horaFin = fin;
      } else {
        const [diaStr, horas] = horario.split(" ");
        dia = diaStr;
        const [inicio, fin] = horas.split("-");
        horaInicio = inicio;
        horaFin = fin;
      }

      if (dia === diaActual) {
        const [horaIni, minIni] = horaInicio.split(":").map(Number);
        const [horaF, minF] = horaFin.split(":").map(Number);

        const minutosActuales = horaActual * 60 + minutoActual;
        const minutosInicio = horaIni * 60 + minIni;
        const minutosFin = horaF * 60 + minF;

        if (minutosActuales >= minutosInicio && minutosActuales <= minutosFin) {
          return true;
        }
      }
    }

    return false;
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando detalles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!curso) {
    return null;
  }

  const docente = getDocente();
  const porcentajeOcupacion = calcularPorcentajeOcupacion();
  const cuposDisponibles = getCuposDisponibles();
  const diasSemana = getDiasSemana();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>📚</span>
            </div>
            <div>
              <h2 className={styles.title}>{curso.nombre}</h2>
              <p className={styles.subtitle}>
                Código: #{curso.id_curso.toString().padStart(4, "0")}
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Vista General
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "estudiantes" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("estudiantes")}
          >
            👥 Estudiantes ({estudiantes.length})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "horario" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("horario")}
          >
            🕐 Horario
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === "overview" && (
            <div className={styles.overview}>
              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👨‍🏫</div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Docente</p>
                    <p className={styles.statValue}>
                      {docente
                        ? `${docente.nombres} ${docente.apellidos}`
                        : "No asignado"}
                    </p>
                    {docente && (
                      <p className={styles.statSubtext}>
                        {docente.especialidad}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Cupo</p>
                    <p className={styles.statValue}>
                      {estudiantes.length} / {curso.cupo_estudiante}
                    </p>
                    <p className={styles.statSubtext}>
                      {cuposDisponibles} disponibles
                    </p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📅</div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Días de Clase</p>
                    <p className={styles.statValue}>{diasSemana.length}</p>
                    <p className={styles.statSubtext}>
                      {diasSemana.join(", ")}
                    </p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    {curso.estado ? "✅" : "⚠️"}
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Estado</p>
                    <p
                      className={`${styles.statValue} ${
                        curso.estado ? styles.active : styles.inactive
                      }`}
                    >
                      {curso.estado ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>
                    Ocupación del Curso
                  </span>
                  <span className={styles.progressPercent}>
                    {porcentajeOcupacion}%
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${porcentajeOcupacion}%`,
                      backgroundColor:
                        porcentajeOcupacion >= 90
                          ? "#ef4444"
                          : porcentajeOcupacion >= 70
                          ? "#f59e0b"
                          : "#10b981",
                    }}
                  />
                </div>
              </div>

              {/* Docente Info */}
              {docente && (
                <div className={styles.docenteCard}>
                  <h3 className={styles.sectionTitle}>
                    👨‍🏫 Información del Docente
                  </h3>
                  <div className={styles.docenteInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Nombre:</span>
                      <span className={styles.infoValue}>
                        {docente.nombres} {docente.apellidos}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Especialidad:</span>
                      <span className={styles.infoValue}>
                        {docente.especialidad}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Cédula:</span>
                      <span className={styles.infoValue}>{docente.cedula}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "estudiantes" && (
            <div className={styles.estudiantes}>
              <div className={styles.estudiantesHeader}>
                <h3 className={styles.sectionTitle}>
                  👥 Estudiantes Inscritos ({estudiantes.length}/
                  {curso.cupo_estudiante})
                </h3>
                {usuarioActual?.rol === "administrador" && (
                  <button
                    className={styles.btnAgregarEstudiante}
                    onClick={handleAbrirModalInscribir}
                    disabled={estudiantes.length >= curso.cupo_estudiante}
                  >
                    ➕ Inscribir Estudiante
                  </button>
                )}
              </div>

              {verificarHorarioActual() && (
                <div className={styles.asistenciaHeader}>
                  <div className={styles.asistenciaInfo}>
                    <span className={styles.asistenciaIcon}>✅</span>
                    <div>
                      <p className={styles.asistenciaTitle}>
                        ¡Hora de registrar asistencia!
                      </p>
                      <p className={styles.asistenciaSubtitle}>
                        Estás en el horario de clase de este curso
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles.asistenciaButton}
                    onClick={() => setMostrarAsistencia(true)}
                  >
                    📋 Registrar Asistencia
                  </button>
                </div>
              )}

              {estudiantes.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>👥</span>
                  <p className={styles.emptyText}>
                    No hay estudiantes inscritos en este curso
                  </p>
                  {usuarioActual?.rol === "administrador" && (
                    <button
                      className={styles.btnEmptyAction}
                      onClick={handleAbrirModalInscribir}
                    >
                      Inscribir Primer Estudiante
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.estudiantesGrid}>
                  {estudiantes.map((estudiante, index) => (
                    <div
                      key={estudiante.id_estudiante}
                      className={styles.estudianteCard}
                    >
                      <div className={styles.estudianteHeader}>
                        <div className={styles.estudianteAvatar}>
                          {index + 1}
                        </div>
                        <div className={styles.estudianteInfo}>
                          <h4 className={styles.estudianteNombre}>
                            {estudiante.nombres} {estudiante.apellidos}
                          </h4>
                          <p className={styles.estudianteDetalle}>
                            📧 {estudiante.correo}
                          </p>
                          <p className={styles.estudianteDetalle}>
                            CI: {estudiante.cedula}
                          </p>
                        </div>
                      </div>
                      <div className={styles.estudianteFooter}>
                        {usuarioActual?.rol === "administrador" && (
                          <button
                            className={styles.btnEliminarEstudiante}
                            onClick={() =>
                              handleEliminarInscripcion(
                                estudiante.id_inscripcion,
                                `${estudiante.nombres} ${estudiante.apellidos}`
                              )
                            }
                            title="Eliminar del curso"
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "horario" && (
            <div className={styles.horario}>
              <h3 className={styles.sectionTitle}>📅 Horario Semanal</h3>
              <div className={styles.horarioGrid}>
                {curso.horario.map((horario, index) => {
                  let dia, inicio, fin;

                  // Si es un objeto con dia y hora
                  if (
                    typeof horario === "object" &&
                    horario.dia &&
                    horario.hora
                  ) {
                    dia = horario.dia;
                    const [horaInicio, horaFin] = horario.hora.split("-");
                    inicio = horaInicio;
                    fin = horaFin;
                  } else {
                    // Si es un string en formato "Dia HH:MM-HH:MM"
                    const [diaStr, horas] = horario.split(" ");
                    dia = diaStr;
                    const [horaInicio, horaFin] = horas.split("-");
                    inicio = horaInicio;
                    fin = horaFin;
                  }

                  return (
                    <div key={index} className={styles.horarioCard}>
                      <div className={styles.horarioDia}>{dia}</div>
                      <div className={styles.horarioHoras}>
                        <div className={styles.horarioTime}>
                          <span className={styles.timeLabel}>Inicio</span>
                          <span className={styles.timeValue}>{inicio}</span>
                        </div>
                        <div className={styles.horarioArrow}>→</div>
                        <div className={styles.horarioTime}>
                          <span className={styles.timeLabel}>Fin</span>
                          <span className={styles.timeValue}>{fin}</span>
                        </div>
                      </div>
                      <div className={styles.horarioDuration}>
                        Duración: {calcularDuracion(inicio, fin)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline semanal */}
              <div className={styles.timelineSection}>
                <h4 className={styles.timelineTitle}>Vista Semanal</h4>
                <div className={styles.timeline}>
                  {[
                    "Lunes",
                    "Martes",
                    "Miércoles",
                    "Jueves",
                    "Viernes",
                    "Sábado",
                    "Domingo",
                  ].map((dia) => {
                    const clasesDelDia = curso.horario.filter((h) => {
                      if (typeof h === "object" && h.dia) {
                        return h.dia === dia;
                      }
                      return h.startsWith(dia);
                    });
                    return (
                      <div key={dia} className={styles.timelineDay}>
                        <div className={styles.timelineDayName}>
                          {dia.substring(0, 3)}
                        </div>
                        <div className={styles.timelineDayContent}>
                          {clasesDelDia.length > 0 ? (
                            clasesDelDia.map((clase, idx) => {
                              let horas;
                              if (typeof clase === "object" && clase.hora) {
                                horas = clase.hora;
                              } else {
                                horas = clase.split(" ")[1];
                              }
                              return (
                                <div key={idx} className={styles.timelineClass}>
                                  {horas}
                                </div>
                              );
                            })
                          ) : (
                            <div className={styles.timelineEmpty}>-</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro de Asistencia */}
      {mostrarAsistencia && (
        <RegistroAsistencia
          curso={curso}
          estudiantes={estudiantes}
          onClose={() => setMostrarAsistencia(false)}
          onSuccess={() => {
            setMostrarAsistencia(false);
            cargarDetalles();
          }}
        />
      )}

      {/* Modal de Inscripción de Estudiante */}
      {mostrarModalInscribir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>➕ Inscribir Estudiante</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => {
                  setMostrarModalInscribir(false);
                  setEstudianteSeleccionado("");
                }}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <p>
                  <strong>Curso:</strong> {curso.nombre}
                </p>
                <p>
                  <strong>Cupos disponibles:</strong>{" "}
                  {curso.cupo_estudiante - estudiantes.length} /{" "}
                  {curso.cupo_estudiante}
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="estudiante-select">
                  Seleccionar Estudiante:
                </label>
                <select
                  id="estudiante-select"
                  className={styles.formSelect}
                  value={estudianteSeleccionado}
                  onChange={(e) => setEstudianteSeleccionado(e.target.value)}
                  disabled={procesando}
                >
                  <option value="">-- Seleccione un estudiante --</option>
                  {estudiantesDisponibles.map((est) => (
                    <option key={est.id_estudiante} value={est.id_estudiante}>
                      {est.nombres} {est.apellidos} - CI: {est.cedula}
                    </option>
                  ))}
                </select>
                {estudiantesDisponibles.length === 0 && (
                  <p className={styles.noDisponibles}>
                    No hay estudiantes disponibles para inscribir
                  </p>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.btnCancelar}
                onClick={() => {
                  setMostrarModalInscribir(false);
                  setEstudianteSeleccionado("");
                }}
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                className={styles.btnInscribir}
                onClick={handleInscribirEstudiante}
                disabled={
                  procesando ||
                  !estudianteSeleccionado ||
                  estudiantesDisponibles.length === 0
                }
              >
                {procesando ? "Inscribiendo..." : "Inscribir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const calcularDuracion = (inicio, fin) => {
  const [horaInicio, minInicio] = inicio.split(":").map(Number);
  const [horaFin, minFin] = fin.split(":").map(Number);
  const duracionMin = horaFin * 60 + minFin - (horaInicio * 60 + minInicio);
  const horas = Math.floor(duracionMin / 60);
  const minutos = duracionMin % 60;
  return `${horas}h ${minutos > 0 ? minutos + "m" : ""}`;
};

export default CursoDetalles;
