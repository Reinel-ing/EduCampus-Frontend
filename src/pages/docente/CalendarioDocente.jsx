import React, { useState, useEffect } from "react";

import { useAuth }                 from "../../context/AuthContext";
import { obtenerCursosPorDocente } from "../../services/cursoService";
import BannerPage from "../../components/estudiante/BannerPage";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const DIAS_FULL   = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const MESES       = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" },

  navRow: { display: "flex", alignItems: "center", gap: "10px" },
  navBtn: {
    background:     "rgba(255,255,255,0.15)",
    border:         "1px solid rgba(255,255,255,0.3)",
    color:          "#fff",
    borderRadius:   "7px",
    width:          "32px",
    height:         "32px",
    cursor:         "pointer",
    fontSize:       "15px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  mesLabel: { fontSize: "13px", fontWeight: 700, color: "#fff", minWidth: "130px", textAlign: "center" },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 280px", gap: "14px" },

  calCard:    { background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "16px" },
  diasHeader: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "6px" },
  diaHeader:  { textAlign: "center", fontSize: "10.5px", fontWeight: 700, color: "#9ca3af", padding: "4px 0" },
  calGrid:    { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px" },

  celda: (esHoy, tieneClase, seleccionado) => ({
    textAlign:  "center",
    padding:    "7px 4px",
    borderRadius: "7px",
    cursor:     tieneClase ? "pointer" : "default",
    fontSize:   "12.5px",
    fontWeight: esHoy ? 800 : 400,
    background: esHoy
      ? "linear-gradient(135deg,#0f2744,#1e40af)"
      : seleccionado ? "#eff6ff"
      : tieneClase  ? "#f8fafc"
      : "transparent",
    color:  esHoy ? "#fff" : "#374151",
    border: seleccionado && !esHoy ? "2px solid #1e40af" : "2px solid transparent",
    position: "relative",
  }),
  punto: { width: 5, height: 5, borderRadius: "50%", background: "#1e40af", margin: "2px auto 0" },

  claseHoraBox: {
    background:   "#eff6ff",
    borderRadius: "6px",
    padding:      "4px 8px",
    fontSize:     "10.5px",
    fontWeight:   700,
    color:        "#1e40af",
    flexShrink:   0,
    minWidth:     "70px",
    textAlign:    "center",
  },

  sideCard:    { background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "16px" },
  sideTitle:   { fontSize: "11px", fontWeight: 700, color: "#0f2744", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" },
  claseItem:   { display: "flex", gap: "10px", padding: "8px 0", alignItems: "flex-start" },
  claseNombre: { fontSize: "12.5px", fontWeight: 600, color: "#0f2744" },
  claseDia:    { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
};

// Convierte el JSONB de horario a entradas planas {dia, hora, nombre_curso}
// Soporta objetos ({dia, horaInicio, horaFin}) y strings ("Lunes 08:00-10:00")
function parsearHorario(cursos) {
  const clases = [];
  cursos.forEach((curso) => {
    if (!Array.isArray(curso.horario)) return;
    curso.horario.forEach((h) => {
      let dia  = h.dia ?? "";
      let hora = "";

      if (typeof h === "string") {
        const match = h.match(/^(\w+)\s+(.+)$/);
        if (match) { dia = match[1]; hora = match[2]; }
      } else {
        if (h.horaInicio && h.horaFin) hora = `${h.horaInicio}-${h.horaFin}`;
      }

      if (dia) clases.push({ dia, hora, nombre_curso: curso.nombre });
    });
  });
  return clases;
}

const CalendarioDocente = () => {
  const { usuario } = useAuth();
  const [clases,   setClases]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [mes,      setMes]      = useState(new Date());
  const [diaSelec, setDiaSelec] = useState(null);

  const hoy = new Date();

  useEffect(() => { cargarHorario(); }, []);

  const cargarHorario = async () => {
    try {
      const data = await obtenerCursosPorDocente(usuario.id);
      if (!data?.error && Array.isArray(data)) setClases(parsearHorario(data));
    } catch (error) {
      console.error("[CalendarioDocente]", error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarMes = (delta) => {
    setMes(new Date(mes.getFullYear(), mes.getMonth() + delta, 1));
    setDiaSelec(null);
  };

  const tieneClase   = (diaSemana) => clases.some((c) => c.dia === DIAS_FULL[diaSemana]);
  const clasesDelDia = (diaSemana) => clases.filter((c) => c.dia === DIAS_FULL[diaSemana]);

  const primerDia = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
  const diasEnMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();

  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let i = 1; i <= diasEnMes; i++) celdas.push(i);

  const clasesDiaSelec = diaSelec !== null
    ? clasesDelDia(new Date(mes.getFullYear(), mes.getMonth(), diaSelec).getDay())
    : [];

  const clasesSemanales = clases
    .slice()
    .sort((a, b) => DIAS_FULL.indexOf(a.dia) - DIAS_FULL.indexOf(b.dia));

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const navMes = (
    <div style={styles.navRow}>
      <button style={styles.navBtn} onClick={() => cambiarMes(-1)}>‹</button>
      <span style={styles.mesLabel}>{MESES[mes.getMonth()]} {mes.getFullYear()}</span>
      <button style={styles.navBtn} onClick={() => cambiarMes(1)}>›</button>
    </div>
  );

  return (
    <div style={styles.page}>

      <BannerPage
        icono="🗓️"
        titulo="Calendario de Clases"
        subtitulo={
          clases.length > 0
            ? `${clases.length} sesion${clases.length !== 1 ? "es" : ""} semanales programadas`
            : "Sin clases programadas"
        }
        extra={navMes}
      />

      <div style={styles.twoCol}>

        <div style={styles.calCard}>
          <div style={styles.diasHeader}>
            {DIAS_SEMANA.map((d) => (
              <div key={d} style={styles.diaHeader}>{d}</div>
            ))}
          </div>

          <div style={styles.calGrid}>
            {celdas.map((dia, i) => {
              if (!dia) return <div key={i} />;
              const fecha     = new Date(mes.getFullYear(), mes.getMonth(), dia);
              const diaSemana = fecha.getDay();
              const esHoy     = dia === hoy.getDate() && mes.getMonth() === hoy.getMonth() && mes.getFullYear() === hoy.getFullYear();
              const hayClase  = tieneClase(diaSemana);
              const selec     = diaSelec === dia;

              return (
                <div
                  key={i}
                  style={styles.celda(esHoy, hayClase, selec)}
                  onClick={() => hayClase && setDiaSelec(selec ? null : dia)}
                >
                  {dia}
                  {hayClase && !esHoy && <div style={styles.punto} />}
                </div>
              );
            })}
          </div>

          {clasesDiaSelec.length > 0 && (
            <div style={{ marginTop: "14px", borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f2744", marginBottom: "8px" }}>
                Clases del {diaSelec} de {MESES[mes.getMonth()]}
              </div>
              {clasesDiaSelec.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", gap: "10px", alignItems: "center", padding: "7px 0",
                    borderBottom: i < clasesDiaSelec.length - 1 ? "1px solid #f9fafb" : "none",
                  }}
                >
                  <div style={styles.claseHoraBox}>{c.hora || "—"}</div>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f2744" }}>{c.nombre_curso}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "14px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { bg: "linear-gradient(135deg,#0f2744,#1e40af)", label: "Hoy" },
              { bg: "#f8fafc", border: "1px solid #dde3ec", label: "Dia con clase (clic para ver)" },
            ].map((ley, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: ley.bg, border: ley.border || "none" }} />
                <span style={{ fontSize: "11px", color: "#6b7280" }}>{ley.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sideCard}>
          <div style={styles.sideTitle}>Mi Horario Semanal</div>
          {clasesSemanales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#9ca3af", fontSize: "12.5px" }}>
              Sin clases programadas
            </div>
          ) : (
            clasesSemanales.map((c, i) => (
              <div
                key={i}
                style={{
                  ...styles.claseItem,
                  borderBottom: i < clasesSemanales.length - 1 ? "1px solid #f9fafb" : "none",
                }}
              >
                <div style={styles.claseHoraBox}>
                  {c.hora ? c.hora.split("-")[0] : "—"}
                </div>
                <div>
                  <div style={styles.claseNombre}>{c.nombre_curso}</div>
                  <div style={styles.claseDia}>{c.dia}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarioDocente;
