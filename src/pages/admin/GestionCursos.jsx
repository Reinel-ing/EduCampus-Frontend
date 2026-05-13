import React, { useState, useEffect } from "react";
import {
  listarCursos,
  eliminarCurso,
  crearCurso,
  actualizarCurso,
} from "../../services/cursoService";
import { listarDocentes } from "../../services/docenteService";
import { Curso } from "../../models/Curso";
import { Docente } from "../../models/Docente";
import CursoCard from "../../components/administrador/CursoCard";
import CursoDetalles from "../../components/administrador/CursoDetalles";
import FormModal from "../../components/ui/FormModal";
import { useCursoValidator } from "../../hooks/useCursoValidator";
import styles from "../../styles/GestionCursos.module.css";

const GestionCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detallesOpen, setDetallesOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { errors, validate } = useCursoValidator();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cursosData, docentesData] = await Promise.all([
        listarCursos(),
        listarDocentes(),
      ]);

      if (cursosData.error) {
        setError(cursosData.message);
      } else {
        const cursosArray = cursosData.map((c) => new Curso(c));
        setCursos(cursosArray);
      }

      if (!docentesData.error) {
        const docentesArray = docentesData.map((d) => new Docente(d));
        setDocentes(docentesArray);
      }
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este curso?")) {
      try {
        await eliminarCurso(id);
        cargarDatos();
      } catch (err) {
        alert("Error al eliminar curso");
      }
    }
  };

  const handleAgregar = () => {
    setCursoSeleccionado(null);
    setModalOpen(true);
  };

  const handleEditar = (curso) => {
    setCursoSeleccionado(curso);
    setModalOpen(true);
  };

  const handleDetails = (curso) => {
    setCursoSeleccionado(curso);
    setDetallesOpen(true);
  };

  const handleSubmit = async (formData) => {
    // El horario ahora viene directamente como array desde HorarioSelector
    const cursoData = {
      ...formData,
      cupo_estudiante: parseInt(formData.cupo_estudiante),
      id_docente: parseInt(formData.id_docente),
    };

    if (!validate(cursoData)) {
      return;
    }

    setIsLoading(true);
    try {
      if (cursoSeleccionado?.id_curso) {
        await actualizarCurso(cursoSeleccionado.id_curso, cursoData);
      } else {
        await crearCurso(cursoData);
      }
      setModalOpen(false);
      cargarDatos();
    } catch (error) {
      alert("Error al guardar curso: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cursoFields = [
    {
      name: "nombre",
      label: "Nombre del Curso",
      type: "text",
      required: true,
      placeholder: "Ej: Matemáticas Básicas",
      fullWidth: true,
    },
    {
      name: "id_docente",
      label: "Docente",
      type: "select",
      required: true,
      options: docentes
        .filter((d) => d.estado)
        .map((d) => ({
          value: d.id_docente,
          label: `${d.nombres} ${d.apellidos} - ${d.especialidad}`,
        })),
    },
    {
      name: "cupo_estudiante",
      label: "Cupo de Estudiantes",
      type: "number",
      required: true,
      placeholder: "Ej: 30",
    },
    {
      name: "horario",
      label: "Horario del Curso",
      type: "horario",
      required: true,
      fullWidth: true,
    },
    {
      name: "estado",
      label: "Curso Activo",
      type: "checkbox",
      fullWidth: true,
    },
  ];

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📚 Gestión de Cursos</h1>
        <button className={styles.createButton} onClick={handleAgregar}>
          + Crear Curso
        </button>
      </div>

      <div className={styles.coursesGrid}>
        {cursos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay cursos registrados</p>
            <small>
              Crea tu primer curso haciendo clic en el botón "Crear Curso"
            </small>
          </div>
        ) : (
          cursos.map((curso) => (
            <CursoCard
              key={curso.id_curso}
              curso={curso}
              docentes={docentes}
              onEdit={handleEditar}
              onDelete={handleEliminar}
              onDetails={handleDetails}
            />
          ))
        )}
      </div>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={cursoSeleccionado ? "Editar Curso" : "Nuevo Curso"}
        icon="📚"
        fields={cursoFields}
        initialData={cursoSeleccionado || {}}
        validationErrors={errors}
        isLoading={isLoading}
      />

      {detallesOpen && cursoSeleccionado && (
        <CursoDetalles
          cursoId={cursoSeleccionado.id_curso}
          docentes={docentes}
          onClose={() => {
            setDetallesOpen(false);
            setCursoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default GestionCursos;
