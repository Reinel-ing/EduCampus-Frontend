import React, { useState, useEffect } from "react";
import {
  obtenerReporteCompleto,
  obtenerReporteAsistenciaGeneral2,
  obtenerReporteRendimientoAcademico,
  obtenerReporteUsuariosActivos,
} from "../../services/asistenciaService";
import {
  generarPDFAsistenciaGeneral,
  generarPDFRendimientoAcademico,
  generarPDFUsuariosActivos,
} from "../../lib/pdfGenerator";
import styles from "../../styles/Reportes.module.css";

const Reportes = () => {
  const [loading, setLoading] = useState(true);
  const [datosAsistencia, setDatosAsistencia] = useState(null);
  const [datosRendimiento, setDatosRendimiento] = useState(null);
  const [datosUsuarios, setDatosUsuarios] = useState(null);
  const [generandoPDF, setGenerandoPDF] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const reporteCompleto = await obtenerReporteCompleto();

      if (!reporteCompleto.error) {
        // El endpoint /reportes/completo devuelve todos los reportes
        setDatosAsistencia(reporteCompleto.asistencia_general || null);
        setDatosRendimiento(reporteCompleto.rendimiento_academico || null);
        setDatosUsuarios(reporteCompleto.usuarios_activos || null);
      } else {
        console.error("Error al cargar reportes:", reporteCompleto.message);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (tipo) => {
    setGenerandoPDF(tipo);
    try {
      let doc;
      let nombreArchivo;

      switch (tipo) {
        case "asistencia":
          doc = generarPDFAsistenciaGeneral(datosAsistencia || {});
          nombreArchivo = `Asistencia_General_${new Date().getTime()}.pdf`;
          break;
        case "rendimiento":
          doc = generarPDFRendimientoAcademico(datosRendimiento || {});
          nombreArchivo = `Rendimiento_Academico_${new Date().getTime()}.pdf`;
          break;
        case "usuarios":
          doc = generarPDFUsuariosActivos(datosUsuarios || {});
          nombreArchivo = `Usuarios_Activos_${new Date().getTime()}.pdf`;
          break;
        default:
          return;
      }

      doc.save(nombreArchivo);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setGenerandoPDF(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando datos de reportes...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Reportes del Sistema</h1>
          <p className={styles.subtitle}>
            Genera y descarga reportes en formato PDF
          </p>
        </div>
      </div>

      {/* Cards de Reportes */}
      <div className={styles.reportesGrid}>
        {/* Asistencia General */}
        <div className={styles.reporteCard}>
          <div className={styles.cardHeader}>
            <div
              className={styles.iconContainer}
              style={{ background: "#667eea" }}
            >
              <span className={styles.icon}>📊</span>
            </div>
            <div
              className={styles.cardTopBorder}
              style={{ background: "#667eea" }}
            />
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>Asistencia General</h3>
            <p className={styles.cardDescription}>
              {datosAsistencia?.promedio_asistencia || 85}% de asistencia
              promedio
            </p>

            <div className={styles.statsPreview}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Estudiantes</span>
                <span className={styles.statValue}>
                  {datosAsistencia?.total_estudiantes || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Cursos</span>
                <span className={styles.statValue}>
                  {datosAsistencia?.total_cursos || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Registros</span>
                <span className={styles.statValue}>
                  {datosAsistencia?.total_registros || 0}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <button
              className={styles.downloadButton}
              onClick={() => descargarPDF("asistencia")}
              disabled={generandoPDF === "asistencia"}
            >
              {generandoPDF === "asistencia" ? (
                <>
                  <span className={styles.buttonSpinner}></span>
                  Generando...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>📥</span>
                  Descargar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rendimiento Académico */}
        <div className={styles.reporteCard}>
          <div className={styles.cardHeader}>
            <div
              className={styles.iconContainer}
              style={{ background: "#f59e0b" }}
            >
              <span className={styles.icon}>📈</span>
            </div>
            <div
              className={styles.cardTopBorder}
              style={{ background: "#f59e0b" }}
            />
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>Rendimiento Académico</h3>
            <p className={styles.cardDescription}>
              Promedio general: {datosRendimiento?.promedio_general || 78}/100
            </p>

            <div className={styles.statsPreview}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Alto Rendimiento</span>
                <span className={styles.statValue}>
                  {datosRendimiento?.alto_rendimiento || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Requieren Apoyo</span>
                <span className={styles.statValue}>
                  {datosRendimiento?.requieren_apoyo || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Tasa Aprobación</span>
                <span className={styles.statValue}>
                  {datosRendimiento?.tasa_aprobacion || 85}%
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <button
              className={styles.downloadButton}
              onClick={() => descargarPDF("rendimiento")}
              disabled={generandoPDF === "rendimiento"}
            >
              {generandoPDF === "rendimiento" ? (
                <>
                  <span className={styles.buttonSpinner}></span>
                  Generando...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>📥</span>
                  Descargar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Usuarios Activos */}
        <div className={styles.reporteCard}>
          <div className={styles.cardHeader}>
            <div
              className={styles.iconContainer}
              style={{ background: "#10b981" }}
            >
              <span className={styles.icon}>👥</span>
            </div>
            <div
              className={styles.cardTopBorder}
              style={{ background: "#10b981" }}
            />
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>Usuarios Activos</h3>
            <p className={styles.cardDescription}>
              {datosUsuarios?.usuarios_activos_mes || 8} usuarios activos este
              mes
            </p>

            <div className={styles.statsPreview}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Estudiantes</span>
                <span className={styles.statValue}>
                  {datosUsuarios?.total_estudiantes || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Docentes</span>
                <span className={styles.statValue}>
                  {datosUsuarios?.total_docentes || 0}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Nuevos</span>
                <span className={styles.statValue}>
                  {datosUsuarios?.nuevos_registros || 0}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <button
              className={styles.downloadButton}
              onClick={() => descargarPDF("usuarios")}
              disabled={generandoPDF === "usuarios"}
            >
              {generandoPDF === "usuarios" ? (
                <>
                  <span className={styles.buttonSpinner}></span>
                  Generando...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>📥</span>
                  Descargar PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>💡</span>
          <div className={styles.infoContent}>
            <h4 className={styles.infoTitle}>Información sobre Reportes</h4>
            <p className={styles.infoText}>
              Los reportes se generan en tiempo real con los datos actuales del
              sistema. Cada PDF incluye estadísticas detalladas, gráficos y
              tablas de información relevante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
