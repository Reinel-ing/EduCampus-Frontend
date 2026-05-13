import React, { useState, useRef } from "react";
import TablaDocentes from "../../components/administrador/TablaDocentes";
import TablaEstudiantes from "../../components/administrador/TablaEstudiantes";
import FormModal from "../../components/ui/FormModal";
import { crearDocente, actualizarDocente } from "../../services/docenteService";
import {
  crearEstudiante,
  actualizarEstudiante,
} from "../../services/estudianteService";
import { useDocenteValidator } from "../../hooks/useDocenteValidator";
import { useEstudianteValidator } from "../../hooks/useEstudianteValidator";
import styles from "../../styles/GestionUsuarios.module.css";

const GestionUsuarios = () => {
  // Estados para modales
  const [modalDocenteOpen, setModalDocenteOpen] = useState(false);
  const [modalEstudianteOpen, setModalEstudianteOpen] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validators
  const { errors: docenteErrors, validate: validateDocente } =
    useDocenteValidator();
  const { errors: estudianteErrors, validate: validateEstudiante } =
    useEstudianteValidator();

  // Referencias para recargar tablas
  const tablaDocentesRef = useRef();
  const tablaEstudiantesRef = useRef();

  // Campos del formulario de Docentes
  const docenteFields = [
    {
      name: "nombres",
      label: "Nombres",
      type: "text",
      required: true,
      placeholder: "Ej: Juan Carlos",
    },
    {
      name: "apellidos",
      label: "Apellidos",
      type: "text",
      required: true,
      placeholder: "Ej: Pérez García",
    },
    {
      name: "cedula",
      label: "Cédula",
      type: "text",
      required: true,
      placeholder: "Ej: 1234567890",
    },
    {
      name: "correo",
      label: "Correo Electrónico",
      type: "email",
      required: true,
      placeholder: "Ej: docente@email.com",
    },
    {
      name: "contraseña",
      label: docenteSeleccionado
        ? "Contraseña (dejar vacío para no cambiar)"
        : "Contraseña",
      type: "password",
      required: !docenteSeleccionado,
      placeholder: "Mínimo 6 caracteres",
    },
    {
      name: "especialidad",
      label: "Especialidad",
      type: "text",
      required: true,
      placeholder: "Ej: Matemáticas",
    },
    {
      name: "estado",
      label: "Estado Activo",
      type: "checkbox",
      fullWidth: true,
    },
  ];

  // Campos del formulario de Estudiantes
  const estudianteFields = [
    {
      name: "nombres",
      label: "Nombres",
      type: "text",
      required: true,
      placeholder: "Ej: María José",
    },
    {
      name: "apellidos",
      label: "Apellidos",
      type: "text",
      required: true,
      placeholder: "Ej: López Martínez",
    },
    {
      name: "cedula",
      label: "Cédula",
      type: "text",
      required: true,
      placeholder: "Ej: 0987654321",
    },
    {
      name: "correo",
      label: "Correo Electrónico",
      type: "email",
      required: true,
      placeholder: "Ej: estudiante@email.com",
    },
    {
      name: "contraseña",
      label: estudianteSeleccionado
        ? "Contraseña (dejar vacío para no cambiar)"
        : "Contraseña",
      type: "password",
      required: !estudianteSeleccionado,
      placeholder: "Mínimo 6 caracteres",
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "tel",
      required: true,
      placeholder: "Ej: 0991234567",
    },
    {
      name: "estado",
      label: "Estado Activo",
      type: "checkbox",
      fullWidth: true,
    },
  ];

  // Handlers para Docentes
  const handleAgregarDocente = () => {
    setDocenteSeleccionado(null);
    setModalDocenteOpen(true);
  };

  const handleEditarDocente = (docente) => {
    setDocenteSeleccionado(docente);
    setModalDocenteOpen(true);
  };

  const handleSubmitDocente = async (formData) => {
    const esEdicion = !!docenteSeleccionado?.id_docente;

    if (!validateDocente(formData, esEdicion)) {
      return;
    }

    setIsLoading(true);
    try {
      // Si es edición y la contraseña está vacía, no la enviamos
      const dataToSend = { ...formData };
      if (
        esEdicion &&
        (!dataToSend.contraseña || dataToSend.contraseña.trim() === "")
      ) {
        delete dataToSend.contraseña;
      }

      if (esEdicion) {
        await actualizarDocente(docenteSeleccionado.id_docente, dataToSend);
      } else {
        await crearDocente(dataToSend);
      }
      setModalDocenteOpen(false);
      tablaDocentesRef.current?.recargar();
    } catch (error) {
      alert("Error al guardar docente: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para Estudiantes
  const handleAgregarEstudiante = () => {
    setEstudianteSeleccionado(null);
    setModalEstudianteOpen(true);
  };

  const handleEditarEstudiante = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setModalEstudianteOpen(true);
  };

  const handleSubmitEstudiante = async (formData) => {
    const esEdicion = !!estudianteSeleccionado?.id_estudiante;

    if (!validateEstudiante(formData, esEdicion)) {
      return;
    }

    setIsLoading(true);
    try {
      // Si es edición y la contraseña está vacía, no la enviamos
      const dataToSend = { ...formData };
      if (
        esEdicion &&
        (!dataToSend.contraseña || dataToSend.contraseña.trim() === "")
      ) {
        delete dataToSend.contraseña;
      }

      if (esEdicion) {
        await actualizarEstudiante(
          estudianteSeleccionado.id_estudiante,
          dataToSend
        );
      } else {
        await crearEstudiante(dataToSend);
      }
      setModalEstudianteOpen(false);
      tablaEstudiantesRef.current?.recargar();
    } catch (error) {
      alert("Error al guardar estudiante: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sección Docentes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📚</span>
            Docentes
          </h2>
          <button className={styles.addButton} onClick={handleAgregarDocente}>
            + Agregar Docente
          </button>
        </div>
        <TablaDocentes onEdit={handleEditarDocente} ref={tablaDocentesRef} />
      </section>

      {/* Sección Estudiantes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎓</span>
            Estudiantes
          </h2>
          <button
            className={styles.addButton}
            onClick={handleAgregarEstudiante}
          >
            + Agregar Estudiante
          </button>
        </div>
        <TablaEstudiantes
          onEdit={handleEditarEstudiante}
          ref={tablaEstudiantesRef}
        />
      </section>

      {/* Modal Docente */}
      <FormModal
        isOpen={modalDocenteOpen}
        onClose={() => setModalDocenteOpen(false)}
        onSubmit={handleSubmitDocente}
        title={docenteSeleccionado ? "Editar Docente" : "Nuevo Docente"}
        icon="👨‍🏫"
        fields={docenteFields}
        initialData={docenteSeleccionado || {}}
        validationErrors={docenteErrors}
        isLoading={isLoading}
      />

      {/* Modal Estudiante */}
      <FormModal
        isOpen={modalEstudianteOpen}
        onClose={() => setModalEstudianteOpen(false)}
        onSubmit={handleSubmitEstudiante}
        title={
          estudianteSeleccionado ? "Editar Estudiante" : "Nuevo Estudiante"
        }
        icon="🎓"
        fields={estudianteFields}
        initialData={estudianteSeleccionado || {}}
        validationErrors={estudianteErrors}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GestionUsuarios;
