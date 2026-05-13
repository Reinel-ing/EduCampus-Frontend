import React, { useState, useEffect } from "react";
import styles from "../../styles/HorarioSelector.module.css";

const HorarioSelector = ({ value = [], onChange, error }) => {
  const [horarios, setHorarios] = useState([]);

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Generar horas de 6 AM a 10 PM
  const generateHours = () => {
    const hours = [];
    for (let i = 6; i <= 22; i++) {
      const hour = i.toString().padStart(2, "0");
      hours.push(`${hour}:00`);
    }
    return hours;
  };

  const horas = generateHours();

  useEffect(() => {
    // Convertir array de strings a objetos para el selector
    if (Array.isArray(value) && value.length > 0) {
      const parsedHorarios = value
        .map((item, index) => {
          // Si ya es un objeto, usarlo directamente
          if (typeof item === "object" && item !== null) {
            return {
              id: item.id || index,
              dia: item.dia,
              horaInicio: item.horaInicio || item.hora_inicio,
              horaFin: item.horaFin || item.hora_fin,
            };
          }

          // Si es un string, parsear formato: "Lunes 08:00-10:00"
          if (typeof item === "string") {
            const match = item.match(/^(\w+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
            if (match) {
              return {
                id: index,
                dia: match[1],
                horaInicio: match[2],
                horaFin: match[3],
              };
            }
          }

          return null;
        })
        .filter(Boolean);
      setHorarios(parsedHorarios);
    } else {
      setHorarios([]);
    }
  }, [value]);

  const agregarHorario = () => {
    const nuevoHorario = {
      id: Date.now(),
      dia: "Lunes",
      horaInicio: "08:00",
      horaFin: "10:00",
    };
    const nuevosHorarios = [...horarios, nuevoHorario];
    setHorarios(nuevosHorarios);
    notificarCambio(nuevosHorarios);
  };

  const eliminarHorario = (id) => {
    const nuevosHorarios = horarios.filter((h) => h.id !== id);
    setHorarios(nuevosHorarios);
    notificarCambio(nuevosHorarios);
  };

  const actualizarHorario = (id, campo, valor) => {
    const nuevosHorarios = horarios.map((h) =>
      h.id === id ? { ...h, [campo]: valor } : h
    );
    setHorarios(nuevosHorarios);
    notificarCambio(nuevosHorarios);
  };

  const notificarCambio = (nuevosHorarios) => {
    // Convertir objetos a array de strings en formato: "Lunes 08:00-10:00"
    const horarioStrings = nuevosHorarios.map(
      (h) => `${h.dia} ${h.horaInicio}-${h.horaFin}`
    );
    onChange(horarioStrings);
  };

  return (
    <div className={`${styles.horarioSelector} ${error ? styles.error : ""}`}>
      <div className={styles.selectorHeader}>
        <span className={styles.selectorTitle}>📅 Horarios del Curso</span>
        <button
          type="button"
          className={styles.addButton}
          onClick={agregarHorario}
        >
          + Agregar Horario
        </button>
      </div>

      <div className={styles.horarioList}>
        {horarios.length === 0 ? (
          <div className={styles.emptyState}>
            No hay horarios configurados. Haz clic en "Agregar Horario" para
            comenzar.
          </div>
        ) : (
          horarios.map((horario) => (
            <div key={horario.id} className={styles.horarioItem}>
              <div className={styles.selectField}>
                <label className={styles.selectLabel}>Día</label>
                <select
                  value={horario.dia}
                  onChange={(e) =>
                    actualizarHorario(horario.id, "dia", e.target.value)
                  }
                  className={styles.select}
                >
                  {diasSemana.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.selectLabel}>Hora Inicio</label>
                <select
                  value={horario.horaInicio}
                  onChange={(e) =>
                    actualizarHorario(horario.id, "horaInicio", e.target.value)
                  }
                  className={styles.select}
                >
                  {horas.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.selectLabel}>Hora Fin</label>
                <select
                  value={horario.horaFin}
                  onChange={(e) =>
                    actualizarHorario(horario.id, "horaFin", e.target.value)
                  }
                  className={styles.select}
                >
                  {horas.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => eliminarHorario(horario.id)}
                title="Eliminar horario"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {error && <span className={styles.errorMessage}>⚠️ {error}</span>}
    </div>
  );
};

export default HorarioSelector;
