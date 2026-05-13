import { useState } from "react";

export function useCursoValidator() {
  const [errors, setErrors] = useState({});

  function validate(curso) {
    const newErrors = {};

    if (!curso.nombre || curso.nombre.trim().length < 3) {
      newErrors.nombre =
        "El nombre es obligatorio y debe tener al menos 3 caracteres.";
    }

    if (!curso.cupo_estudiante || curso.cupo_estudiante < 1) {
      newErrors.cupo_estudiante = "El cupo de estudiantes debe ser al menos 1.";
    }

    if (!curso.id_docente) {
      newErrors.id_docente = "Debe seleccionar un docente.";
    }

    if (
      !curso.horario ||
      !Array.isArray(curso.horario) ||
      curso.horario.length === 0
    ) {
      newErrors.horario =
        "Debe agregar al menos un horario (debe ser una lista).";
    }

    if (typeof curso.estado !== "boolean") {
      newErrors.estado = "El estado debe ser verdadero o falso.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return { errors, validate };
}
