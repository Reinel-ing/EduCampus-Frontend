import React, { useState, useEffect } from "react";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  crearConfiguracion,
} from "../../services/configuracionService";
import { Configuracion } from "../../models/Configuracion";
import { useConfiguracionValidator } from "../../hooks/useConfiguracionValidator";
import styles from "../../styles/Configuracion.module.css";

const ConfiguracionPage = () => {
  const [configuracion, setConfiguracion] = useState(null);
  const [formData, setFormData] = useState({
    nombre_institucion: "",
    email_contacto: "",
    ano_academico: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [existeConfiguracion, setExisteConfiguracion] = useState(false);

  const { errors, validate } = useConfiguracionValidator();

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const data = await obtenerConfiguracion();

      if (!data.error && data.id) {
        const config = new Configuracion(data);
        setConfiguracion(config);
        setFormData({
          nombre_institucion: config.nombre_institucion,
          email_contacto: config.email_contacto,
          ano_academico: config.ano_academico,
        });
        setExisteConfiguracion(true);
      } else {
        setExisteConfiguracion(false);
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
      setExisteConfiguracion(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(formData)) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, corrija los errores en el formulario",
      });
      return;
    }

    setSaving(true);
    setMensaje(null);

    try {
      let resultado;

      if (existeConfiguracion) {
        resultado = await actualizarConfiguracion(formData);
      } else {
        resultado = await crearConfiguracion(formData);
      }

      if (!resultado.error) {
        setMensaje({
          tipo: "success",
          texto: existeConfiguracion
            ? "Configuración actualizada exitosamente"
            : "Configuración creada exitosamente",
        });
        setExisteConfiguracion(true);
        const config = new Configuracion(resultado);
        setConfiguracion(config);

        // Actualizar formData con los valores guardados
        setFormData({
          nombre_institucion: config.nombre_institucion,
          email_contacto: config.email_contacto,
          ano_academico: config.ano_academico,
        });

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      } else {
        setMensaje({
          tipo: "error",
          texto: resultado.message || "Error al guardar la configuración",
        });
      }
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al guardar la configuración",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"400px" }}>
        <div style={{ width:40, height:40, border:"4px solid #e2e8f0", borderTopColor:"#1e40af", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding:"22px 24px", background:"#f0f4f8", minHeight:"100%", boxSizing:"border-box" }}>
      {/* Banner institucional */}
      <div style={{ background:"linear-gradient(135deg,#0f2744 0%,#1e40af 100%)", borderRadius:"12px", padding:"18px 24px", marginBottom:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:"17px", fontWeight:800, color:"#fff", marginBottom:"3px" }}>Configuración del Sistema</div>
          <div style={{ fontSize:"12.5px", color:"rgba(255,255,255,.6)" }}>Gestiona la información general de la institución</div>
        </div>
        <div style={{ fontSize:"36px", opacity:0.7 }}>⚙️</div>
      </div>
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={{ display:"none" }}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <span className={styles.headerIcon}>⚙️</span>
            <div>
              <h1 className={styles.title}>Configuración del Sistema</h1>
              <p className={styles.subtitle}>
                Gestiona la información general de la institución
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div
          className={`${styles.mensaje} ${
            mensaje.tipo === "success"
              ? styles.mensajeSuccess
              : styles.mensajeError
          }`}
        >
          <span className={styles.mensajeIcon}>
            {mensaje.tipo === "success" ? "✓" : "⚠"}
          </span>
          <span>{mensaje.texto}</span>
        </div>
      )}

      {/* Formulario */}
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre_institucion" className={styles.label}>
              <span className={styles.labelIcon}>🏛️</span>
              NOMBRE DE LA INSTITUCIÓN
            </label>
            <input
              type="text"
              id="nombre_institucion"
              name="nombre_institucion"
              value={formData.nombre_institucion}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.nombre_institucion ? styles.inputError : ""
              }`}
              placeholder="Ej: EduCampus"
            />
            {errors.nombre_institucion && (
              <span className={styles.errorText}>
                {errors.nombre_institucion}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email_contacto" className={styles.label}>
              <span className={styles.labelIcon}>📧</span>
              EMAIL DE CONTACTO
            </label>
            <input
              type="email"
              id="email_contacto"
              name="email_contacto"
              value={formData.email_contacto}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.email_contacto ? styles.inputError : ""
              }`}
              placeholder="Ej: contacto@educampus.edu"
            />
            {errors.email_contacto && (
              <span className={styles.errorText}>{errors.email_contacto}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ano_academico" className={styles.label}>
              <span className={styles.labelIcon}>📅</span>
              AÑO ACADÉMICO
            </label>
            <input
              type="text"
              id="ano_academico"
              name="ano_academico"
              value={formData.ano_academico}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.ano_academico ? styles.inputError : ""
              }`}
              placeholder="Ej: 2024-2025"
            />
            {errors.ano_academico && (
              <span className={styles.errorText}>{errors.ano_academico}</span>
            )}
            <small className={styles.hint}>
              Use el formato YYYY-YYYY (ejemplo: 2024-2025)
            </small>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className={styles.buttonSpinner}></span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>💾</span>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>💡</div>
        <div className={styles.infoContent}>
          <h3 className={styles.infoTitle}>Información Importante</h3>
          <ul className={styles.infoList}>
            <li>Esta configuración se aplicará en todo el sistema</li>
            <li>
              El nombre de la institución aparecerá en reportes y documentos
            </li>
            <li>
              El email de contacto será usado para notificaciones del sistema
            </li>
            <li>
              El año académico ayuda a organizar la información por períodos
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ConfiguracionPage;
