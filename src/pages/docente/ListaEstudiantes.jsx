import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerEstudiantesCalificaciones } from "../../services/docenteService";
import styles from "../../styles/ListaEstudiantes.module.css";
import dashStyles from "../../styles/Dashboards.module.css";

const ListaEstudiantes = () => {
  const { usuario } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtroOrden, setFiltroOrden] = useState("nombre"); // nombre, promedio, asistencia
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  useEffect(() => {
    filtrarYOrdenarEstudiantes();
  }, [busqueda, estudiantes, filtroOrden]);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      console.log("Cargando estudiantes para docente ID:", usuario.id);
      const data = await obtenerEstudiantesCalificaciones(usuario.id);
      console.log("Respuesta de API:", data);
      if (!data.error && Array.isArray(data)) {
        setEstudiantes(data);
        console.log("Estudiantes cargados:", data.length);
      } else {
        console.error("Error en respuesta:", data);
        setEstudiantes([]);
      }
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarYOrdenarEstudiantes = () => {
    let resultado = [...estudiantes];

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(
        (est) =>
          est.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
          est.curso.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar
    resultado.sort((a, b) => {
      switch (filtroOrden) {
        case "nombre":
          return a.nombre_completo.localeCompare(b.nombre_completo);
        case "promedio":
          return (Number(b.promedio) || 0) - (Number(a.promedio) || 0);
        case "asistencia":
          return (
            (Number(b.asistencia?.porcentaje) || 0) -
            (Number(a.asistencia?.porcentaje) || 0)
          );
        default:
          return 0;
      }
    });

    setEstudiantesFiltrados(resultado);
  };

  const getPromedioColor = (promedio) => {
    const valor = Number(promedio) || 0;
    if (valor >= 4.5) return styles.excelente;
    if (valor >= 4.0) return styles.bueno;
    if (valor >= 3.0) return styles.regular;
    return styles.bajo;
  };

  const getAsistenciaColor = (porcentaje) => {
    if (porcentaje >= 90) return styles.asistenciaAlta;
    if (porcentaje >= 75) return styles.asistenciaMedia;
    return styles.asistenciaBaja;
  };

  const calcularPromedioGeneral = () => {
    if (estudiantesFiltrados.length === 0) return 0;
    const suma = estudiantesFiltrados.reduce(
      (acc, est) => acc + (Number(est.promedio) || 0),
      0
    );
    return (suma / estudiantesFiltrados.length).toFixed(2);
  };

  const calcularAsistenciaPromedio = () => {
    if (estudiantesFiltrados.length === 0) return 0;
    const suma = estudiantesFiltrados.reduce(
      (acc, est) => acc + (Number(est.asistencia?.porcentaje) || 0),
      0
    );
    return (suma / estudiantesFiltrados.length).toFixed(1);
  };

  if (loading) {
    return (
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"400px" }}>
        <div style={{ width:40, height:40, border:"4px solid #e2e8f0", borderTopColor:"#1e40af", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={dashStyles.page}>
      {/* Banner institucional */}
      <div style={{ background:"linear-gradient(135deg,#0f2744 0%,#1e40af 100%)", borderRadius:"12px", padding:"18px 24px", marginBottom:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:"17px", fontWeight:800, color:"#fff", marginBottom:"3px" }}>Lista de Estudiantes</div>
          <div style={{ fontSize:"12.5px", color:"rgba(255,255,255,.6)" }}>{estudiantes.length} {estudiantes.length === 1 ? "estudiante registrado" : "estudiantes registrados"} en tus cursos</div>
        </div>
        <div style={{ fontSize:"36px", opacity:0.7 }}>👥</div>
      </div>
    <div className={styles.container}>
      {/* Header con estadísticas */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title} style={{ display:"none" }}>Lista de Estudiantes</h1>
          <p className={styles.subtitle} style={{ display:"none" }}>
            Información completa de todos los estudiantes en tus cursos
          </p>
        </div>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <p className={styles.statValue}>{estudiantesFiltrados.length}</p>
              <p className={styles.statLabel}>Estudiantes</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <p className={styles.statValue}>{calcularPromedioGeneral()}</p>
              <p className={styles.statLabel}>Promedio General</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <p className={styles.statValue}>
                {calcularAsistenciaPromedio()}%
              </p>
              <p className={styles.statLabel}>Asistencia Promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar estudiante por nombre o curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <label className={styles.filterLabel}>Ordenar por:</label>
          <select
            value={filtroOrden}
            onChange={(e) => setFiltroOrden(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="nombre">Nombre</option>
            <option value="promedio">Promedio</option>
            <option value="asistencia">Asistencia</option>
          </select>
        </div>
      </div>

      {/* Tabla de estudiantes */}
      {estudiantesFiltrados.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <p className={styles.emptyText}>
            {busqueda
              ? "No se encontraron estudiantes con ese criterio"
              : "No hay estudiantes inscritos en tus cursos"}
          </p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>NOMBRE</th>
                <th className={styles.tableHeader}>CURSO</th>
                <th className={styles.tableHeader}>PROMEDIO</th>
                <th className={styles.tableHeader}>ASISTENCIA</th>
                <th className={styles.tableHeader}>DETALLES</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((estudiante, index) => (
                <tr key={estudiante.id_estudiante} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentAvatar}>
                        {estudiante.nombre_completo.charAt(0)}
                      </div>
                      <span className={styles.studentName}>
                        {estudiante.nombre_completo}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.courseBadge}>
                      {estudiante.curso}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.promedioContainer}>
                      <span
                        className={`${styles.promedioValue} ${getPromedioColor(
                          estudiante.promedio
                        )}`}
                      >
                        {(Number(estudiante.promedio) || 0).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.asistenciaContainer}>
                      <div className={styles.asistenciaBar}>
                        <div
                          className={`${
                            styles.asistenciaFill
                          } ${getAsistenciaColor(
                            Number(estudiante.asistencia?.porcentaje) || 0
                          )}`}
                          style={{
                            width: `${
                              Number(estudiante.asistencia?.porcentaje) || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className={styles.asistenciaText}>
                        {(
                          Number(estudiante.asistencia?.porcentaje) || 0
                        ).toFixed(1)}
                        %
                      </span>
                      <span className={styles.asistenciaDetalle}>
                        {estudiante.asistencia?.asistencias || 0}/
                        {estudiante.asistencia?.total_clases || 0}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <button
                      className={styles.detailsButton}
                      onClick={() => {
                        setEstudianteSeleccionado(estudiante);
                        setMostrarModal(true);
                      }}
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen inferior */}
      {estudiantesFiltrados.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Mostrando {estudiantesFiltrados.length} de {estudiantes.length}{" "}
            estudiantes
          </p>
        </div>
      )}

      {/* Modal de detalles */}
      {mostrarModal && estudianteSeleccionado && (
        <div
          className={styles.modalOverlay}
          onClick={() => setMostrarModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderInfo}>
                <div className={styles.modalAvatar}>
                  {estudianteSeleccionado.nombre_completo.charAt(0)}
                </div>
                <div>
                  <h2 className={styles.modalTitle}>
                    {estudianteSeleccionado.nombre_completo}
                  </h2>
                  <p className={styles.modalSubtitle}>
                    {estudianteSeleccionado.curso}
                  </p>
                </div>
              </div>
              <button
                className={styles.modalCloseButton}
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>

            {/* Contenido del modal */}
            <div className={styles.modalBody}>
              {/* Sección de estadísticas */}
              <div className={styles.modalStatsGrid}>
                <div className={styles.modalStatCard}>
                  <span className={styles.modalStatIcon}>📊</span>
                  <div>
                    <p className={styles.modalStatLabel}>Promedio</p>
                    <p
                      className={`${styles.modalStatValue} ${getPromedioColor(
                        estudianteSeleccionado.promedio
                      )}`}
                    >
                      {(Number(estudianteSeleccionado.promedio) || 0).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
                <div className={styles.modalStatCard}>
                  <span className={styles.modalStatIcon}>✅</span>
                  <div>
                    <p className={styles.modalStatLabel}>Asistencia</p>
                    <p className={styles.modalStatValue}>
                      {(
                        Number(estudianteSeleccionado.asistencia?.porcentaje) ||
                        0
                      ).toFixed(1)}
                      %
                    </p>
                    <p className={styles.modalStatSubtext}>
                      {estudianteSeleccionado.asistencia?.asistencias || 0}/
                      {estudianteSeleccionado.asistencia?.total_clases || 0}{" "}
                      clases
                    </p>
                  </div>
                </div>
              </div>

              {/* Calificaciones */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>📝 Calificaciones</h3>
                {estudianteSeleccionado.calificaciones &&
                estudianteSeleccionado.calificaciones.length > 0 ? (
                  <div className={styles.calificacionesGrid}>
                    {estudianteSeleccionado.calificaciones.map((cal, index) => (
                      <div key={index} className={styles.calificacionCard}>
                        <div className={styles.calificacionTipo}>
                          Evaluación {cal.tipo_evaluacion}
                        </div>
                        <div
                          className={`${
                            styles.calificacionNota
                          } ${getPromedioColor(cal.nota)}`}
                        >
                          {(Number(cal.nota) || 0).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.modalEmptyText}>
                    No hay calificaciones registradas
                  </p>
                )}
              </div>

              {/* Progreso de asistencia */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>
                  📅 Progreso de Asistencia
                </h3>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={`${
                        styles.progressBarFill
                      } ${getAsistenciaColor(
                        Number(estudianteSeleccionado.asistencia?.porcentaje) ||
                          0
                      )}`}
                      style={{
                        width: `${
                          Number(
                            estudianteSeleccionado.asistencia?.porcentaje
                          ) || 0
                        }%`,
                      }}
                    >
                      <span className={styles.progressBarLabel}>
                        {(
                          Number(
                            estudianteSeleccionado.asistencia?.porcentaje
                          ) || 0
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setMostrarModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ListaEstudiantes;
