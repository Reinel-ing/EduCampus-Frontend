import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  listarEstudiantes,
  eliminarEstudiante,
} from "../../services/estudianteService";
import { Estudiante } from "../../models/Estudiante";
import styles from "../../styles/GestionUsuarios.module.css";

const TablaEstudiantes = forwardRef(({ onEdit }, ref) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // Exponer el método recargar para poder llamarlo desde el padre
  useImperativeHandle(ref, () => ({
    recargar: cargarEstudiantes,
  }));

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const data = await listarEstudiantes();
      if (data.error) {
        setError(data.message);
      } else {
        const estudiantesArray = data.map((est) => new Estudiante(est));
        setEstudiantes(estudiantesArray);
      }
    } catch (err) {
      setError("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este estudiante?")) {
      try {
        await eliminarEstudiante(id);
        cargarEstudiantes();
      } catch (err) {
        alert("Error al eliminar estudiante");
      }
    }
  };

  const estudiantesFiltrados = estudiantes.filter(
    (estudiante) =>
      estudiante.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.cedula?.includes(searchTerm) ||
      estudiante.telefono?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar estudiante por nombre, apellidos, email, cédula o teléfono..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>ID</th>
              <th>NOMBRES</th>
              <th>APELLIDOS</th>
              <th>CÉDULA</th>
              <th>EMAIL</th>
              <th>TELÉFONO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {estudiantesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className={styles.emptyState}>
                    <p>No se encontraron estudiantes</p>
                    <small>Intenta con otros criterios de búsqueda</small>
                  </div>
                </td>
              </tr>
            ) : (
              estudiantesFiltrados.map((estudiante) => (
                <tr key={estudiante.id_estudiante}>
                  <td>{estudiante.id_estudiante}</td>
                  <td>{estudiante.nombres}</td>
                  <td>{estudiante.apellidos}</td>
                  <td>{estudiante.cedula}</td>
                  <td>{estudiante.correo}</td>
                  <td>{estudiante.telefono}</td>
                  <td>
                    <span
                      className={`${styles.estadoBadge} ${
                        estudiante.estado
                          ? styles.estadoActivo
                          : styles.estadoInactivo
                      }`}
                    >
                      {estudiante.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit(estudiante)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleEliminar(estudiante.id_estudiante)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
});

TablaEstudiantes.displayName = "TablaEstudiantes";

export default TablaEstudiantes;
