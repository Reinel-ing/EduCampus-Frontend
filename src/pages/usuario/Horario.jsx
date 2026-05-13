import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerHorarioEstudiante } from "../../services/cursoService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "../../styles/HorarioEstudiante.module.css";

const Horario = () => {
  const { usuario } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const horasBloque = [
    "08:00-10:00",
    "09:00-11:00",
    "10:00-12:00",
    "11:00-13:00",
    "14:00-16:00",
    "15:00-17:00",
    "16:00-18:00",
  ];

  useEffect(() => {
    cargarHorario();
  }, [usuario]);

  const cargarHorario = async () => {
    try {
      setLoading(true);
      const data = await obtenerHorarioEstudiante(usuario.id);
      console.log("Horarios recibidos:", data);
      if (!data.error && Array.isArray(data)) {
        setHorarios(data);
      }
    } catch (error) {
      console.error("Error al cargar horario:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerClasePorDiaYHora = (dia, hora) => {
    // Buscar exactamente por día y hora
    const claseExacta = horarios.find((h) => h.dia === dia && h.hora === hora);
    if (claseExacta) return claseExacta;

    // Si no hay coincidencia exacta, buscar si la hora del curso cae dentro del bloque
    return horarios.find((h) => {
      if (h.dia !== dia) return false;

      // Extraer horas de inicio y fin del bloque y del curso
      const [bloqueInicio] = hora.split("-");
      const [cursoInicio, cursoFin] = h.hora.split("-");

      return bloqueInicio >= cursoInicio && bloqueInicio < cursoFin;
    });
  };

  const descargarHorario = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Mi Horario Semanal", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Estudiante: ${usuario.nombres} ${usuario.apellidos}`, 14, 25);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

    // Preparar datos para la tabla
    const headers = [
      ["HORA", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"],
    ];
    const rows = horasBloque.map((hora) => {
      const row = [hora];
      diasSemana.forEach((dia) => {
        const clase = obtenerClasePorDiaYHora(dia, hora);
        row.push(
          clase
            ? `${clase.nombre_curso}${clase.aula ? `\n${clase.aula}` : ""}`
            : ""
        );
      });
      return row;
    });

    // Generar tabla
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 38,
      theme: "grid",
      headStyles: {
        fillColor: [102, 126, 234],
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: "bold" },
      },
    });

    // Descargar
    doc.save(`Horario_${usuario.nombres}_${usuario.apellidos}.pdf`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando horario...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mi Horario Semanal</h1>
        <button className={styles.btnDescargar} onClick={descargarHorario}>
          📄 Descargar Horario
        </button>
      </div>

      <div className={styles.horarioWrapper}>
        <table className={styles.horarioTable}>
          <thead>
            <tr>
              <th className={styles.headerHora}>HORA</th>
              {diasSemana.map((dia) => (
                <th key={dia} className={styles.headerDia}>
                  {dia.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horasBloque.map((hora) => (
              <tr key={hora}>
                <td className={styles.celdaHora}>{hora}</td>
                {diasSemana.map((dia) => {
                  const clase = obtenerClasePorDiaYHora(dia, hora);
                  return (
                    <td
                      key={`${dia}-${hora}`}
                      className={`${styles.celdaDia} ${
                        clase ? styles.celdaConClase : ""
                      }`}
                    >
                      {clase && (
                        <div className={styles.claseCard}>
                          <div className={styles.claseNombre}>
                            {clase.nombre_curso}
                          </div>
                          <div className={styles.claseInfo}>
                            {clase.aula || "Sin aula"}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {horarios.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📅</span>
          <p className={styles.emptyText}>No tienes clases programadas</p>
        </div>
      )}
    </div>
  );
};

export default Horario;
