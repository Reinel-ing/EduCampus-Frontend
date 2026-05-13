import React, { useState, useEffect } from "react";
import HorarioSelector from "./HorarioSelector";
import styles from "../../styles/FormModal.module.css";

const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  icon,
  fields,
  initialData = {},
  validationErrors = {},
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Inicializar formData con initialData o valores por defecto
      const defaultData = {};
      fields.forEach((field) => {
        if (field.type === "checkbox") {
          defaultData[field.name] = initialData[field.name] ?? true;
        } else {
          defaultData[field.name] = initialData[field.name] ?? "";
        }
      });
      setFormData(defaultData);
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCustomChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const renderField = (field) => {
    const hasError = validationErrors[field.name];

    switch (field.type) {
      case "horario":
        return (
          <div
            key={field.name}
            className={`${styles.formGroup} ${
              field.fullWidth ? styles.fullWidth : ""
            }`}
          >
            <HorarioSelector
              value={formData[field.name] || []}
              onChange={(value) => handleCustomChange(field.name, value)}
              error={hasError ? validationErrors[field.name] : null}
            />
          </div>
        );

      case "select":
        return (
          <div
            key={field.name}
            className={`${styles.formGroup} ${
              field.fullWidth ? styles.fullWidth : ""
            }`}
          >
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className={`${styles.select} ${hasError ? styles.error : ""}`}
              required={field.required}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <span className={styles.errorMessage}>
                ⚠️ {validationErrors[field.name]}
              </span>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div
            key={field.name}
            className={`${styles.formGroup} ${
              field.fullWidth ? styles.fullWidth : ""
            }`}
          >
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <label htmlFor={field.name} className={styles.checkboxLabel}>
                {field.label}
              </label>
            </div>
            {hasError && (
              <span className={styles.errorMessage}>
                ⚠️ {validationErrors[field.name]}
              </span>
            )}
          </div>
        );

      default:
        return (
          <div
            key={field.name}
            className={`${styles.formGroup} ${
              field.fullWidth ? styles.fullWidth : ""
            }`}
          >
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            <input
              type={field.type || "text"}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${styles.input} ${hasError ? styles.error : ""}`}
              required={field.required}
              disabled={field.disabled}
            />
            {hasError && (
              <span className={styles.errorMessage}>
                ⚠️ {validationErrors[field.name]}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.modalIcon}>{icon}</span>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.form}>
              {fields.map((field) => renderField(field))}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.buttonCancel}`}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonSubmit}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  Guardando...
                </>
              ) : (
                <>
                  💾{" "}
                  {initialData.id || initialData.id_docente
                    ? "Actualizar"
                    : "Guardar"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
