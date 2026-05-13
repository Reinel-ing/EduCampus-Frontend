import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerHorarioEstudiante } from "../../services/cursoService";

const CalendarioEstudiante = () => {
  const { usuario } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesActual] = useState(new Date());

  useEffect(() => {
    cargarHorario();
  }, []);

  const cargarHorario = async () => {
    try {
      setLoading(true);
      const data = await obtenerHorarioEstudiante(usuario.id);
      if (!data.error && Array.isArray(data)) setHorarios(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diasNombre = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay();
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const hoy = new Date();

  const tieneClase = (dia) => {
    const nombreDia = diasNombre[dia];
    return horarios.some((h) => h.dia === nombreDia);
  };

  const clasesDelDia = (dia) => {
    const nombreDia = diasNombre[dia];
    return horarios.filter((h) => h.dia === nombreDia);
  };

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#667eea", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let i = 1; i <= diasEnMes; i++) celdas.push(i);

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>📅 Calendario</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
          {mesActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        {/* Cabecera días */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
          {diasSemana.map((d) => (
            <div key={d} style={{ textAlign: "center", fontWeight: 700, fontSize: "0.8rem", color: "#64748b", padding: "0.5rem" }}>{d}</div>
          ))}
        </div>

        {/* Días del mes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.25rem" }}>
          {celdas.map((dia, i) => {
            if (!dia) return <div key={i} />;
            const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
            const diaSemana = fecha.getDay();
            const esHoy = dia === hoy.getDate() && mesActual.getMonth() === hoy.getMonth() && mesActual.getFullYear() === hoy.getFullYear();
            const hayClase = tieneClase(diaSemana);

            return (
              <div key={i} onClick={() => hayClase && setDiaSeleccionado(dia)}
                style={{
                  textAlign: "center", padding: "0.5rem 0.25rem", borderRadius: 8, cursor: hayClase ? "pointer" : "default",
                  background: esHoy ? "linear-gradient(135deg,#667eea,#764ba2)" : hayClase ? "#eff6ff" : "transparent",
                  color: esHoy ? "white" : "#1e293b",
                  border: diaSeleccionado === dia ? "2px solid #667eea" : "2px solid transparent",
                  position: "relative", fontSize: "0.9rem", fontWeight: esHoy ? 700 : 400,
                }}>
                {dia}
                {hayClase && !esHoy && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#667eea", margin: "2px auto 0" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clases del día seleccionado */}
      {diaSeleccionado && (() => {
        const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), diaSeleccionado);
        const clases = clasesDelDia(fecha.getDay());
        return clases.length > 0 ? (
          <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 1rem", fontWeight: 700, color: "#1e293b" }}>
              Clases del {diaSeleccionado} de {mesActual.toLocaleDateString("es-ES", { month: "long" })}
            </h3>
            {clases.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", background: "#f8fafc", borderRadius: 8, marginBottom: "0.5rem", borderLeft: "4px solid #667eea" }}>
                <span style={{ fontSize: "1.5rem" }}>📚</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>{c.nombre_curso}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>🕐 {c.hora}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null;
      })()}

      {/* Leyenda */}
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
        {[
          { color: "linear-gradient(135deg,#667eea,#764ba2)", label: "Hoy" },
          { color: "#eff6ff", label: "Día con clase", border: "1px solid #bfdbfe" },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: l.color, border: l.border || "none" }} />
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioEstudiante;