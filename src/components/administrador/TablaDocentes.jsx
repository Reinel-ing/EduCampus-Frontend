import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { listarDocentes, eliminarDocente } from "../../services/docenteService";
import { Docente } from "../../models/Docente";
import styles from "../../styles/GestionUsuarios.module.css";

const TablaDocentes = forwardRef(({ onEdit }, ref) => {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarDocentes();
  }, []);

  // Exponer el método recargar para poder llamarlo desde el padre
  useImperativeHandle(ref, () => ({
    recargar: cargarDocentes,
  }));

  const cargarDocentes = async () => {
    try {
      setLoading(true);
      const data = await listarDocentes();
      if (data.error) {
        setError(data.message);
      } else {
        const docentesArray = data.map((doc) => new Docente(doc));
        setDocentes(docentesArray);
      }
    } catch (err) {
      setError("Error al cargar docentes");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este docente?")) {
      try {
        await eliminarDocente(id);
        cargarDocentes();
      } catch (err) {
        alert("Error al eliminar docente");
      }
    }
  };

  const docentesFiltrados = docentes.filter(
    (docente) =>
      docente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.cedula.includes(searchTerm) ||
      docente.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="🔍 Buscar docente por nombre, apellidos, cédula o especialidad..."
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
              <th>ESPECIALIDAD</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {docentesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className={styles.emptyState}>
                    <p>No se encontraron docentes</p>
                    <small>Intenta con otros criterios de búsqueda</small>
                  </div>
                </td>
              </tr>
            ) : (
              docentesFiltrados.map((docente) => (
                <tr key={docente.id_docente}>
                  <td>{docente.id_docente}</td>
                  <td>{docente.nombres}</td>
                  <td>{docente.apellidos}</td>
                  <td>{docente.cedula}</td>
                  <td>{docente.especialidad}</td>
                  <td>
                    <span
                      className={`${styles.estadoBadge} ${
                        docente.estado
                          ? styles.estadoActivo
                          : styles.estadoInactivo
                      }`}
                    >
                      {docente.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit(docente)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleEliminar(docente.id_docente)}
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

TablaDocentes.displayName = "TablaDocentes";

export default TablaDocentes;
