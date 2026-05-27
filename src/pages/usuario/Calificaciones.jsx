import React, { useState, useEffect } from "react";
import jsPDF     from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth }                            from "../../context/AuthContext";
import { obtenerCursosPorEstudiante }         from "../../services/cursoService";
import { obtenerCalificacionesPorEstudiante } from "../../services/calificacionService";
import BannerPage  from "../../components/estudiante/BannerPage";
import NotaResumen from "../../components/estudiante/NotaResumen";

const Calificaciones = () => {
  const { usuario } = useAuth();
  const [cursos,         setCursos]         = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [usuario]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cursosData, califData] = await Promise.all([
        obtenerCursosPorEstudiante(usuario.id),
        obtenerCalificacionesPorEstudiante(usuario.id),
      ]);
      if (!cursosData.error)  setCursos(cursosData);
      if (!califData.error)   setCalificaciones(califData);
    } catch (error) {
      console.error("[Calificaciones]", error);
    } finally {
      setLoading(false);
    }
  };

  // tipo_evaluacion: 1=Parcial 1, 2=Parcial 2, 3=Final
  const getRawNota = (idCurso, tipo) => {
    const entrada = calificaciones.find(
      (c) => c.id_curso === idCurso && c.tipo_evaluacion === tipo
    );
    return entrada ? Number(entrada.nota) : null;
  };

  const calcularPromedioCurso = (idCurso) => {
    const p1  = getRawNota(idCurso, 1);
    const p2  = getRawNota(idCurso, 2);
    const fin = getRawNota(idCurso, 3);
    if (p1 == null || p2 == null || fin == null) return null;
    return (p1 * 0.3 + p2 * 0.3 + fin * 0.4).toFixed(2);
  };

  const calcularPromedioGeneral = () => {
    const promedios = cursos
      .map((c) => calcularPromedioCurso(c.id_curso))
      .filter(Boolean)
      .map(Number);
    if (promedios.length === 0) return "0.0";
    return (promedios.reduce((acc, p) => acc + p, 0) / promedios.length).toFixed(1);
  };

  const descargarBoletin = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Boletin de Calificaciones", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Estudiante: ${usuario.nombres} ${usuario.apellidos}`, 14, 25);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

    const rows = cursos.map((curso) => {
      const p1       = getRawNota(curso.id_curso, 1);
      const p2       = getRawNota(curso.id_curso, 2);
      const fin      = getRawNota(curso.id_curso, 3);
      const promedio = calcularPromedioCurso(curso.id_curso);
      const estado   = promedio == null
        ? "EN PROGRESO"
        : Number(promedio) >= 3.0 ? "APROBADO" : "REPROBADO";
      return [
        curso.nombre,
        p1  != null ? p1.toFixed(1)  : "-",
        p2  != null ? p2.toFixed(1)  : "-",
        fin != null ? fin.toFixed(1) : "-",
        promedio ?? "-",
        estado,
      ];
    });

    autoTable(doc, {
      head: [["CURSO", "PARCIAL 1", "PARCIAL 2", "FINAL", "PROMEDIO", "ESTADO"]],
      body: rows,
      startY: 38,
      theme: "grid",
      headStyles: { fillColor: [30, 64, 175], fontSize: 10, fontStyle: "bold" },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 60 }, 5: { halign: "center" } },
      didParseCell: (data) => {
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

    const finalY = (doc.lastAutoTable?.finalY || 158) + 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`Promedio General: ${calcularPromedioGeneral()}`, 105, finalY, { align: "center" });
    doc.save(`Boletin_${usuario.nombres}_${usuario.apellidos}.pdf`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const promedioGeneral = calcularPromedioGeneral();

  return (
    <div style={{ padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" }}>

      <BannerPage
        icono="📝"
        titulo="Mis Calificaciones"
        subtitulo={
          cursos.length > 0
            ? `${cursos.length} curso${cursos.length !== 1 ? "s" : ""} registrado${cursos.length !== 1 ? "s" : ""}`
            : "Sin calificaciones registradas"
        }
        extra={
          cursos.length > 0 ? (
            <button
              onClick={descargarBoletin}
              style={{
                padding:    "9px 18px",
                background: "rgba(255,255,255,0.15)",
                border:     "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                color:      "#fff",
                fontWeight: 700,
                fontSize:   "12.5px",
                cursor:     "pointer",
              }}
            >
              📄 Descargar Boletín
            </button>
          ) : null
        }
      />

      {cursos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📊</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f2744", marginBottom: "6px" }}>
            Sin calificaciones registradas
          </div>
          <div style={{ fontSize: "12.5px", color: "#6b7280" }}>
            El docente aún no ha registrado notas en tus cursos
          </div>
        </div>
      ) : (
        <>
          {cursos.map((curso) => (
            <NotaResumen
              key={curso.id_curso}
              nombreCurso={curso.nombre}
              parcial1={getRawNota(curso.id_curso, 1)}
              parcial2={getRawNota(curso.id_curso, 2)}
              final={getRawNota(curso.id_curso, 3)}
            />
          ))}

          <div style={{
            background:     "#fff",
            borderRadius:   "10px",
            border:         "1px solid #dde3ec",
            padding:        "14px 18px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginTop:      "4px",
          }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>
              Promedio general de todos los cursos
            </span>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#0f2744" }}>
              {promedioGeneral} / 5.0
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Calificaciones;
