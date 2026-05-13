import { useState } from "react";

export const useConfiguracionValidator = () => {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};

    // Nombre de institución
    if (!data.nombre_institucion || data.nombre_institucion.trim() === "") {
      newErrors.nombre_institucion = "El nombre de la institución es requerido";
    } else if (data.nombre_institucion.length < 3) {
      newErrors.nombre_institucion =
        "El nombre debe tener al menos 3 caracteres";
    }

    // Email de contacto
    if (!data.email_contacto || data.email_contacto.trim() === "") {
      newErrors.email_contacto = "El email de contacto es requerido";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email_contacto)) {
        newErrors.email_contacto = "Email no válido";
      }
    }

    // Año académico
    if (!data.ano_academico || data.ano_academico.trim() === "") {
      newErrors.ano_academico = "El año académico es requerido";
    } else {
      // Validar formato año-año (ej: 2024-2025)
      const anoRegex = /^\d{4}-\d{4}$/;
      if (!anoRegex.test(data.ano_academico)) {
        newErrors.ano_academico =
          "Formato inválido (use YYYY-YYYY, ej: 2024-2025)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return { errors, validate, clearErrors };
};
