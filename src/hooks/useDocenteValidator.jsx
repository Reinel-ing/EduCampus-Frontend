import { useState } from "react";

export function useDocenteValidator() {
  const [errors, setErrors] = useState({});

  function validate(docente, esEdicion = false) {
    const newErrors = {};
    if (!docente.nombres || docente.nombres.trim().length < 3) {
      newErrors.nombres =
        "El nombre es obligatorio y debe tener al menos 3 caracteres.";
    }
    if (!docente.apellidos || docente.apellidos.trim().length < 3) {
      newErrors.apellidos =
        "El apellido es obligatorio y debe tener al menos 3 caracteres.";
    }
    if (!docente.cedula || docente.cedula.trim().length < 6) {
      newErrors.cedula =
        "La cédula es obligatoria y debe tener al menos 6 caracteres.";
    }
    if (!docente.correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(docente.correo)) {
      newErrors.correo = "El correo es obligatorio y debe ser válido.";
    }
    // Validar contraseña solo si no es edición o si se proporciona una nueva
    if (!esEdicion) {
      if (!docente.contraseña || docente.contraseña.trim().length < 6) {
        newErrors.contraseña =
          "La contraseña es obligatoria y debe tener al menos 6 caracteres.";
      }
    } else if (
      docente.contraseña &&
      docente.contraseña.trim().length > 0 &&
      docente.contraseña.trim().length < 6
    ) {
      newErrors.contraseña =
        "La contraseña debe tener al menos 6 caracteres si desea cambiarla.";
    }
    if (!docente.especialidad || docente.especialidad.trim().length < 3) {
      newErrors.especialidad =
        "La especialidad es obligatoria y debe tener al menos 3 caracteres.";
    }
    if (typeof docente.estado !== "boolean") {
      newErrors.estado = "El estado debe ser verdadero o falso.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return { errors, validate };
}
