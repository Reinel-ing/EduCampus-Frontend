import React, { useState, useEffect } from "react";
import {
  registrarAsistencia,
  obtenerPorcentajeAsistencia,
} from "../../services/asistenciaService";
import styles from "../../styles/RegistroAsistencia.module.css";

const RegistroAsistencia = ({ curso, estudiantes, onClose, onSuccess }) => {
  const [asistencias, setAsistencias] = useState({});
  const [porcentajes, setPorcentajes] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [fecha] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    // Inicializar asistencias como presente para todos
    const inicial = {};
    estudiantes.forEach((est) => {
      inicial[est.id_estudiante] = true;
    });
    setAsistencias(inicial);

    // Cargar porcentajes de asistencia
    cargarPorcentajes();
  }, [estudiantes]);

  const cargarPorcentajes = async () => {
    const porcentajesData = {};
    for (const estudiante of estudiantes) {
      const resultado = await obtenerPorcentajeAsistencia(
        estudiante.id_estudiante,
        curso.id_curso
      );
      if (!resultado.error) {
        porcentajesData[estudiante.id_estudiante] = resultado.porcentaje;
      }
    }
    setPorcentajes(porcentajesData);
  };

  const toggleAsistencia = (estudianteId) => {
    setAsistencias((prev) => ({
      ...prev,
      [estudianteId]: !prev[estudianteId],
    }));
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);

      const promesas = estudiantes.map((estudiante) =>
        registrarAsistencia({
          id_estudiante: estudiante.id_estudiante,
          id_curso: curso.id_curso,
          fecha: fecha,
          estado: asistencias[estudiante.id_estudiante],
        })
      );

      await Promise.all(promesas);

      if (onSuccess) {
        onSuccess();
      }

      alert("Asistencia registrada exitosamente");
      onClose();
    } catch (error) {
      alert("Error al registrar asistencia: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const contarPresentes = () => {
    return Object.values(asistencias).filter((presente) => presente).length;
  };

  const contarAusentes = () => {
    return Object.values(asistencias).filter((presente) => !presente).length;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>✅</span>
            </div>
            <div>
              <h2 className={styles.title}>Registro de Asistencia</h2>
              <p className={styles.subtitle}>
                {curso.nombre} - {new Date(fecha).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>👥</span>
            <span className={styles.statValue}>{estudiantes.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>✅</span>
            <span className={styles.statValue}>{contarPresentes()}</span>
            <span className={styles.statLabel}>Presentes</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>❌</span>
            <span className={styles.statValue}>{contarAusentes()}</span>
            <span className={styles.statLabel}>Ausentes</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.estudiantesList}>
            {estudiantes.map((estudiante) => (
              <div
                key={estudiante.id_estudiante}
                className={`${styles.estudianteItem} ${
                  asistencias[estudiante.id_estudiante]
                    ? styles.presente
                    : styles.ausente
                }`}
                onClick={() => toggleAsistencia(estudiante.id_estudiante)}
              >
                <div className={styles.estudianteInfo}>
                  <h4 className={styles.estudianteNombre}>
                    {estudiante.nombres} {estudiante.apellidos}
                  </h4>
                  <p className={styles.estudianteDetalle}>
                    CI: {estudiante.cedula}
                  </p>
                  {porcentajes[estudiante.id_estudiante] !== undefined && (
                    <p className={styles.estudiantePorcentaje}>
                      Asistencia:{" "}
                      {porcentajes[estudiante.id_estudiante].toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className={styles.checkboxContainer}>
                  <div
                    className={`${styles.checkbox} ${
                      asistencias[estudiante.id_estudiante]
                        ? styles.checked
                        : ""
                    }`}
                  >
                    {asistencias[estudiante.id_estudiante] && (
                      <span className={styles.checkIcon}>✓</span>
                    )}
                  </div>
                  <span className={styles.estadoLabel}>
                    {asistencias[estudiante.id_estudiante]
                      ? "Presente"
                      : "Ausente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            className={styles.saveButton}
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Asistencia"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroAsistencia;
