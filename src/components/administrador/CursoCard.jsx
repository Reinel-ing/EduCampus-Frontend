import React from "react";
import styles from "../../styles/GestionCursos.module.css";

const CursoCard = ({ curso, docentes, onEdit, onDelete, onDetails }) => {
  const docenteNombre = docentes.find((d) => d.id_docente === curso.id_docente);
  const docenteInfo = docenteNombre
    ? `${docenteNombre.nombres} ${docenteNombre.apellidos}`
    : "Sin asignar";

  const formatHorario = (horario) => {
    if (!horario || !Array.isArray(horario) || horario.length === 0) {
      return <div className={styles.horarioItem}>Sin horario definido</div>;
    }

    return horario.map((item, index) => {
      // Si el item es un objeto con dia y hora, lo formateamos
      if (typeof item === "object" && item.dia && item.hora) {
        return (
          <div key={index} className={styles.horarioItem}>
            {item.dia} {item.hora}
          </div>
        );
      }
      // Si es un string, lo mostramos directamente
      return (
        <div key={index} className={styles.horarioItem}>
          {item}
        </div>
      );
    });
  };

  return (
    <div className={styles.courseCard}>
      <span
        className={`${styles.estadoBadge} ${
          curso.estado ? styles.estadoActivo : styles.estadoInactivo
        }`}
      >
        {curso.estado ? "Activo" : "Inactivo"}
      </span>

      <div className={styles.courseHeader}>
        <h3 className={styles.courseName}>{curso.nombre}</h3>
      </div>

      <div className={styles.courseInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>👨‍🏫</span>
          <span className={styles.infoLabel}>Docente:</span> {docenteInfo}
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>👥</span>
          <span className={styles.infoLabel}>Estudiantes:</span>{" "}
          {curso.cupo_estudiante}
        </div>

        <div className={styles.horarioContainer}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📅</span>
            <span className={styles.infoLabel}>Horario:</span>
          </div>
          {formatHorario(curso.horario)}
        </div>
      </div>

      <div className={styles.courseActions}>
        <button
          className={`${styles.actionButton} ${styles.detailsButton}`}
          onClick={() => onDetails(curso)}
        >
          Ver Detalles
        </button>
        <button
          className={`${styles.actionButton} ${styles.editButton}`}
          onClick={() => onEdit(curso)}
          title="Editar"
        >
          ✏️
        </button>
        <button
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={() => onDelete(curso.id_curso)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CursoCard;
