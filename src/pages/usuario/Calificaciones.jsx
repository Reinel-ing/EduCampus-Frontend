import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerCursosPorEstudiante } from "../../services/cursoService";
import { obtenerCalificacionesPorEstudiante } from "../../services/calificacionService";
import { obtenerAsistenciaPorEstudiante } from "../../services/asistenciaService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "../../styles/CalificacionesEstudiante.module.css";

const Calificaciones = () => {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [usuario]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cursosData, calificacionesData, asistenciasData] =
        await Promise.all([
          obtenerCursosPorEstudiante(usuario.id),
          obtenerCalificacionesPorEstudiante(usuario.id),
          obtenerAsistenciaPorEstudiante(usuario.id),
        ]);

      if (!cursosData.error) setCursos(cursosData);
      if (!calificacionesData.error) setCalificaciones(calificacionesData);
      if (!asistenciasData.error) setAsistencias(asistenciasData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNotaPorTipo = (idCurso, tipo) => {
    const calif = calificaciones.find(
      (c) => c.id_curso === idCurso && c.tipo_evaluacion === tipo
    );
    return calif ? (Number(calif.nota) * 20).toFixed(1) : "-";
  };

  const calcularPromedioCurso = (idCurso) => {
    const parcial1 = calificaciones.find(
      (c) => c.id_curso === idCurso && c.tipo_evaluacion === 1
    );
    const parcial2 = calificaciones.find(
      (c) => c.id_curso === idCurso && c.tipo_evaluacion === 2
    );
    const final = calificaciones.find(
      (c) => c.id_curso === idCurso && c.tipo_evaluacion === 3
    );

    if (!parcial1 || !parcial2 || !final) return "-";

    const p1 = Number(parcial1.nota) * 20;
    const p2 = Number(parcial2.nota) * 20;
    const f = Number(final.nota) * 20;

    return (p1 * 0.3 + p2 * 0.3 + f * 0.4).toFixed(1);
  };

  const obtenerEstadoCurso = (promedio) => {
    if (promedio === "-") return "EN PROGRESO";
    const nota = parseFloat(promedio);
    return nota >= 70 ? "APROBADO" : "REPROBADO";
  };

  const calcularAsistenciaCurso = (idCurso) => {
    const asistenciasCurso = asistencias.filter((a) => a.id_curso === idCurso);
    if (asistenciasCurso.length === 0) return "0%";

    const presentes = asistenciasCurso.filter((a) => a.estado === true).length;
    const porcentaje = ((presentes / asistenciasCurso.length) * 100).toFixed(0);
    return `${porcentaje}%`;
  };

  const calcularPromedioGeneral = () => {
    const promedios = cursos
      .map((curso) => calcularPromedioCurso(curso.id_curso))
      .filter((p) => p !== "-")
      .map((p) => parseFloat(p));

    if (promedios.length === 0) return "0.0";
    const suma = promedios.reduce((acc, curr) => acc + curr, 0);
    return (suma / promedios.length).toFixed(1);
  };

  const descargarBoletin = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Boletín de Calificaciones", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Estudiante: ${usuario.nombres} ${usuario.apellidos}`, 14, 25);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

    // Preparar datos para la tabla
    const headers = [
      ["CURSO", "PARCIAL 1", "PARCIAL 2", "FINAL", "PROMEDIO", "ESTADO"],
    ];
    const rows = cursos.map((curso) => {
      const promedio = calcularPromedioCurso(curso.id_curso);
      const estado = obtenerEstadoCurso(promedio);
      return [
        curso.nombre,
        obtenerNotaPorTipo(curso.id_curso, 1),
        obtenerNotaPorTipo(curso.id_curso, 2),
        obtenerNotaPorTipo(curso.id_curso, 3),
        promedio,
        estado,
      ];
    });

    // Generar tabla
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 38,
      theme: "grid",
      headStyles: {
        fillColor: [102, 126, 234],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        5: { halign: "center" },
      },
      didParseCell: (data) => {
        // Colorear estados
        if (data.column.index === 5 && data.row.section === "body") {
          const estado = data.cell.raw;
          if (estado === "APROBADO") {
            data.cell.styles.fillColor = [209, 250, 229];
            data.cell.styles.textColor = [6, 95, 70];
          } else if (estado === "REPROBADO") {
            data.cell.styles.fillColor = [254, 226, 226];
            data.cell.styles.textColor = [153, 27, 27];
          } else {
            data.cell.styles.fillColor = [254, 215, 170];
            data.cell.styles.textColor = [154, 52, 18];
          }
        }
      },
    });

    // Promedio general
    const finalY = (doc.lastAutoTable?.finalY || 158) + 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(
      `Promedio General del Semestre: ${calcularPromedioGeneral()}`,
      105,
      finalY,
      {
        align: "center",
      }
    );

    // Descargar
    doc.save(`Boletin_${usuario.nombres}_${usuario.apellidos}.pdf`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando calificaciones...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Calificaciones</h1>
        <button className={styles.btnDescargar} onClick={descargarBoletin}>
          📄 Descargar Boletín Completo
        </button>
      </div>

      {cursos.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📊</span>
          <p className={styles.emptyText}>
            No tienes cursos con calificaciones registradas
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>CURSO</th>
                  <th>PARCIAL 1</th>
                  <th>PARCIAL 2</th>
                  <th>FINAL</th>
                  <th>PROMEDIO</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso) => {
                  const promedio = calcularPromedioCurso(curso.id_curso);
                  const estado = obtenerEstadoCurso(promedio);
                  return (
                    <tr key={curso.id_curso}>
                      <td className={styles.cursoNombre}>{curso.nombre}</td>
                      <td>{obtenerNotaPorTipo(curso.id_curso, 1)}</td>
                      <td>{obtenerNotaPorTipo(curso.id_curso, 2)}</td>
                      <td>{obtenerNotaPorTipo(curso.id_curso, 3)}</td>
                      <td className={styles.promedio}>{promedio}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            estado === "APROBADO"
                              ? styles.aprobado
                              : estado === "REPROBADO"
                              ? styles.reprobado
                              : styles.enProgreso
                          }`}
                        >
                          {estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.promedioGeneral}>
            <h2>Promedio General del Semestre:</h2>
            <div className={styles.promedioValor}>
              {calcularPromedioGeneral()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calificaciones;
