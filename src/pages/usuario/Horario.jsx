import dashStyles from "../../styles/Dashboards.module.css";
import React, { useState, useEffect } from "react";
import jsPDF     from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth }                  from "../../context/AuthContext";
import { obtenerHorarioEstudiante } from "../../services/cursoService";
import BannerPage from "../../components/estudiante/BannerPage";
import { dayColors } from "../../theme";

const ORDEN_DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" },

  diasGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },

  diaCard: {
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
    overflow:     "hidden",
  },
  diaHeader: {
    padding:        "10px 16px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  diaNombre: { fontSize: "13px", fontWeight: 800, color: "#fff" },
  diaBadge: {
    fontSize:     "10px",
    fontWeight:   700,
    color:        "#fff",
    background:   "rgba(255,255,255,0.25)",
    borderRadius: "10px",
    padding:      "2px 8px",
  },
  claseItem: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
    padding:    "12px 16px",
  },
  claseHoraBox: (color) => ({
    background:   `${color}18`,
    border:       `1px solid ${color}40`,
    borderRadius: "7px",
    padding:      "6px 10px",
    textAlign:    "center",
    flexShrink:   0,
    minWidth:     "80px",
  }),
  claseHora:   (color) => ({ fontSize: "11px", fontWeight: 800, color }),
  claseNombre: { fontSize: "13px", fontWeight: 700, color: "#0f2744" },

  empty: {
    textAlign:    "center",
    padding:      "50px 20px",
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
  },

  btnPDF: {
    padding:      "9px 18px",
    background:   "rgba(255,255,255,0.15)",
    border:       "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px",
    color:        "#fff",
    fontWeight:   700,
    fontSize:     "12.5px",
    cursor:       "pointer",
  },
};

const Horario = () => {
  const { usuario } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { cargarHorario(); }, [usuario]);

  const cargarHorario = async () => {
    try {
      const data = await obtenerHorarioEstudiante(usuario.id);
      if (!data?.error && Array.isArray(data)) setHorarios(data);
    } catch (error) {
      console.error("[Horario]", error);
    } finally {
      setLoading(false);
    }
  };

  // agrupa por dia respetando el orden lunes-domingo
  const porDia = ORDEN_DIAS.reduce((acc, dia) => {
    const clases = horarios.filter((h) => h.dia === dia);
    if (clases.length > 0) acc[dia] = clases;
    return acc;
  }, {});
  const diasConClases = Object.keys(porDia);

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Mi Horario Semanal", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Estudiante: ${usuario.nombres} ${usuario.apellidos}`, 14, 25);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 32);

    autoTable(doc, {
      head: [["DIA", "HORA", "CURSO"]],
      body: horarios.map((h) => [h.dia, h.hora, h.nombre_curso]),
      startY: 38,
      theme: "grid",
      headStyles: { fillColor: [30, 64, 175], fontSize: 10, fontStyle: "bold" },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 35 } },
    });

    doc.save(`Horario_${usuario.nombres}_${usuario.apellidos}.pdf`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={dashStyles.page}>

      <BannerPage
        icono="📆"
        titulo="Mi Horario Semanal"
        subtitulo={
          diasConClases.length > 0
            ? `${horarios.length} clase${horarios.length !== 1 ? "s" : ""} en ${diasConClases.length} dia${diasConClases.length !== 1 ? "s" : ""}`
            : "No tienes clases programadas"
        }
        extra={
          horarios.length > 0 ? (
            <button style={styles.btnPDF} onClick={descargarPDF}>
              📄 Descargar PDF
            </button>
          ) : null
        }
      />

      {diasConClases.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📅</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f2744", marginBottom: "6px" }}>
            Sin clases programadas
          </div>
          <div style={{ fontSize: "12.5px", color: "#6b7280" }}>
            Aun no tienes cursos con horario asignado
          </div>
        </div>
      ) : (
        <div className={dashStyles.statsRow3}>
          {diasConClases.map((dia, index) => {
            const color  = dayColors[index % dayColors.length];
            const clases = porDia[dia];
            return (
              <div key={dia} style={styles.diaCard}>
                <div style={{ ...styles.diaHeader, background: color }}>
                  <span style={styles.diaNombre}>{dia}</span>
                  <span style={styles.diaBadge}>
                    {clases.length} clase{clases.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {clases.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.claseItem,
                      borderBottom: i < clases.length - 1 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <div style={styles.claseHoraBox(color)}>
                      <div style={styles.claseHora(color)}>{c.hora}</div>
                    </div>
                    <div style={styles.claseNombre}>{c.nombre_curso}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Horario;
