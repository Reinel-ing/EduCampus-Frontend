import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerCursosPorDocente } from "../../services/cursoService";
import {
  obtenerMaterialPorDocente,
  subirMaterial,
  obtenerUrlDescarga,
  eliminarMaterial,
} from "../../services/materialService";
import styles from "../../styles/MaterialDidactico.module.css";

const MaterialDidactico = () => {
  const { usuario } = useAuth();
  const [materiales, setMateriales] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [formData, setFormData] = useState({
    nombre_archivo: "",
    id_curso: "",
    archivo: null,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar cursos del docente
      const cursosData = await obtenerCursosPorDocente(usuario.id);
      if (!cursosData.error && Array.isArray(cursosData)) {
        setCursos(cursosData);
      }

      // Cargar materiales del docente
      const materialesData = await obtenerMaterialPorDocente(usuario.id);
      if (!materialesData.error && Array.isArray(materialesData)) {
        setMateriales(materialesData);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF");
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, archivo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre_archivo || !formData.id_curso || !formData.archivo) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      setSubiendo(true);

      const data = new FormData();
      data.append("id_curso", parseInt(formData.id_curso)); // Convertir a int
      data.append("nombre_archivo", formData.nombre_archivo.trim());
      data.append("archivo", formData.archivo);

      console.log("FormData creado - Enviando POST con:");
      console.log("- id_curso:", parseInt(formData.id_curso), "(int)");
      console.log("- nombre_archivo:", formData.nombre_archivo.trim());
      console.log("- archivo:", formData.archivo.name, formData.archivo.type);

      const resultado = await subirMaterial(data);
      console.log("Respuesta del servidor:", resultado);

      if (!resultado.error) {
        alert("Material subido exitosamente");
        setMostrarModal(false);
        setFormData({
          nombre_archivo: "",
          id_curso: "",
          archivo: null,
        });
        cargarDatos();
      } else {
        alert("Error al subir material: " + resultado.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir material");
    } finally {
      setSubiendo(false);
    }
  };

  const handleDescargar = async (materialId) => {
    try {
      const resultado = await obtenerUrlDescarga(materialId);
      if (!resultado.error && resultado.url) {
        window.open(resultado.url, "_blank");
      } else {
        alert("Error al obtener URL de descarga");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar archivo");
    }
  };

  const handleEliminar = async (materialId, nombreArchivo) => {
    if (
      !window.confirm(
        `¿Está seguro de eliminar el material "${nombreArchivo}"?`
      )
    ) {
      return;
    }

    try {
      const resultado = await eliminarMaterial(materialId);
      if (!resultado.error) {
        alert("Material eliminado exitosamente");
        cargarDatos();
      } else {
        alert("Error al eliminar material: " + resultado.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar material");
    }
  };

  const getIconoPorTipo = (nombreArchivo) => {
    if (nombreArchivo.toLowerCase().includes("syllabus")) {
      return "📄";
    } else if (
      nombreArchivo.toLowerCase().includes("presentación") ||
      nombreArchivo.toLowerCase().includes("presentacion")
    ) {
      return "📊";
    } else if (
      nombreArchivo.toLowerCase().includes("ejercicio") ||
      nombreArchivo.toLowerCase().includes("práctica") ||
      nombreArchivo.toLowerCase().includes("practica")
    ) {
      return "📝";
    }
    return "📄";
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando material didáctico...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Material Didáctico</h1>
        <p className={styles.subtitle}>
          Gestiona y comparte recursos educativos con tus estudiantes
        </p>
      </div>

      {/* Botón subir */}
      <button className={styles.btnSubir} onClick={() => setMostrarModal(true)}>
        + Subir Material
      </button>

      {/* Grid de materiales */}
      {materiales.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📚</span>
          <p className={styles.emptyText}>
            No hay material didáctico disponible
          </p>
          <p className={styles.emptySubtext}>
            Comienza subiendo archivos PDF para tus cursos
          </p>
        </div>
      ) : (
        <div className={styles.materialesGrid}>
          {materiales.map((material) => (
            <div key={material.id_material} className={styles.materialCard}>
              <div className={styles.cardIcon}>
                {getIconoPorTipo(material.nombre_archivo)}
              </div>
              <h3 className={styles.cardTitle}>{material.nombre_archivo}</h3>
              <p className={styles.cardCurso}>{material.curso}</p>
              <p className={styles.cardFecha}>
                Subido: {new Date(material.fecha).toLocaleDateString()}
              </p>
              <div className={styles.cardActions}>
                <button
                  className={styles.btnDescargar}
                  onClick={() => handleDescargar(material.id_material)}
                >
                  Descargar
                </button>
                <button
                  className={styles.btnEliminar}
                  onClick={() =>
                    handleEliminar(
                      material.id_material,
                      material.nombre_archivo
                    )
                  }
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para subir material */}
      {mostrarModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !subiendo && setMostrarModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Subir Material Didáctico</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setMostrarModal(false)}
                disabled={subiendo}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Nombre del Material:{" "}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre_archivo}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre_archivo: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="Ej: Syllabus - Matemáticas"
                  required
                  disabled={subiendo}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Curso: <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.id_curso}
                  onChange={(e) =>
                    setFormData({ ...formData, id_curso: e.target.value })
                  }
                  className={styles.formInput}
                  required
                  disabled={subiendo}
                >
                  <option value="">-- Seleccione un curso --</option>
                  {cursos.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Archivo PDF: <span className={styles.required}>*</span>
                </label>
                <div className={styles.fileInputContainer}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    required
                    disabled={subiendo}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className={styles.fileInputLabel}>
                    {formData.archivo
                      ? formData.archivo.name
                      : "Seleccionar archivo PDF"}
                  </label>
                </div>
                <p className={styles.fileHint}>
                  Solo se permiten archivos en formato PDF
                </p>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnCancelar}
                  onClick={() => setMostrarModal(false)}
                  disabled={subiendo}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnGuardar}
                  disabled={subiendo}
                >
                  {subiendo ? "Subiendo..." : "Subir Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialDidactico;
