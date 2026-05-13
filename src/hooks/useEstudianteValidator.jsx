import { useState } from "react";

export function useEstudianteValidator() {
  const [errors, setErrors] = useState({});

  function validate(estudiante, esEdicion = false) {
    const newErrors = {};
    if (!estudiante.nombres || estudiante.nombres.trim().length < 3) {
      newErrors.nombres =
        "El nombre es obligatorio y debe tener al menos 3 caracteres.";
    }
    if (!estudiante.apellidos || estudiante.apellidos.trim().length < 3) {
      newErrors.apellidos =
        "El apellido es obligatorio y debe tener al menos 3 caracteres.";
    }
    if (!estudiante.cedula || estudiante.cedula.trim().length < 6) {
      newErrors.cedula =
        "La cédula es obligatoria y debe tener al menos 6 caracteres.";
    }
    if (
      !estudiante.correo ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(estudiante.correo)
    ) {
      newErrors.correo = "El correo es obligatorio y debe ser válido.";
    }
    // Validar contraseña solo si no es edición o si se proporciona una nueva
    if (!esEdicion) {
      if (!estudiante.contraseña || estudiante.contraseña.trim().length < 6) {
        newErrors.contraseña =
          "La contraseña es obligatoria y debe tener al menos 6 caracteres.";
      }
    } else if (
      estudiante.contraseña &&
      estudiante.contraseña.trim().length > 0 &&
      estudiante.contraseña.trim().length < 6
    ) {
      newErrors.contraseña =
        "La contraseña debe tener al menos 6 caracteres si desea cambiarla.";
    }
    if (!estudiante.telefono || estudiante.telefono.trim().length < 7) {
      newErrors.telefono =
        "El teléfono es obligatorio y debe tener al menos 7 caracteres.";
    }
    if (typeof estudiante.estado !== "boolean") {
      newErrors.estado = "El estado debe ser verdadero o falso.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return { errors, validate };
}
