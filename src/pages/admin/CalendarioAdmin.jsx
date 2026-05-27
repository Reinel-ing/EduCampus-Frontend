import React, { useState } from "react";

const styles = {
  page:  { padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" },
  title: { fontSize: "18px", fontWeight: 800, color: "#0f2744", marginBottom: "3px" },
  sub:   { fontSize: "12.5px", color: "#6b7280", marginBottom: "18px" },
  grid:  { display: "grid", gridTemplateColumns: "1fr 320px", gap: "14px" },
  card:  { background: "#fff", borderRadius: "10px", border: "1px solid #dde3ec", padding: "16px" },
  cardTitle: {
    fontSize: "11px", fontWeight: 700, color: "#0f2744",
    textTransform: "uppercase", letterSpacing: "0.6px",
    marginBottom: "14px", paddingBottom: "8px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  calNav:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" },
  calMonth:  { fontSize:"15px", fontWeight:800, color:"#0f2744" },
  calGrid:   { display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" },
  calDayName:{ textAlign:"center", fontSize:"10px", fontWeight:700, color:"#9ca3af", paddingBottom:"6px" },
  calDay: (isToday, hasEvent, isEmpty, isOther) => ({
    textAlign:"center", padding:"8px 4px", fontSize:"12px",
    borderRadius:"6px", cursor: hasEvent ? "pointer" : "default",
    background: isToday ? "#1e40af" : hasEvent ? "#eff6ff" : "transparent",
    color: isEmpty ? "transparent" : isToday ? "#fff" : isOther ? "#d1d5db" : "#374151",
    fontWeight: isToday ? 700 : hasEvent ? 600 : 400,
    position:"relative", border: hasEvent && !isToday ? "1px solid #bfdbfe" : "1px solid transparent",
  }),
  calDot: { position:"absolute", bottom:"3px", left:"50%", transform:"translateX(-50%)", width:"4px", height:"4px", borderRadius:"50%", background:"#f59e0b" },
  eventItem: (color) => ({
    display:"flex", alignItems:"flex-start", gap:"10px",
    padding:"10px 12px", borderRadius:"8px", marginBottom:"8px",
    background: color==="blue" ? "#eff6ff" : color==="green" ? "#f0fdf4" : color==="red" ? "#fef2f2" : "#fffbeb",
    border:`1px solid ${color==="blue"?"#bfdbfe":color==="green"?"#bbf7d0":color==="red"?"#fecaca":"#fde68a"}`,
  }),
  eventDateBox: (color) => ({
    width:"38px", height:"38px", borderRadius:"8px", flexShrink:0,
    background: color==="blue"?"#1e40af":color==="green"?"#15803d":color==="red"?"#dc2626":"#d97706",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    color:"#fff",
  }),
  eventDay:   { fontSize:"14px", fontWeight:800, lineHeight:1 },
  eventMonth: { fontSize:"8px", textTransform:"uppercase", opacity:0.85 },
  eventTitle: { fontSize:"13px", fontWeight:600, color:"#0f2744", marginBottom:"2px" },
  eventDesc:  { fontSize:"11.5px", color:"#6b7280" },
  badge: (color) => ({
    display:"inline-block", fontSize:"9.5px", fontWeight:700, padding:"2px 7px", borderRadius:"4px",
    background: color==="blue"?"#eff6ff":color==="green"?"#f0fdf4":color==="red"?"#fef2f2":"#fffbeb",
    color:      color==="blue"?"#1e40af":color==="green"?"#15803d":color==="red"?"#dc2626":"#d97706",
    border:`1px solid ${color==="blue"?"#bfdbfe":color==="green"?"#bbf7d0":color==="red"?"#fecaca":"#fde68a"}`,
  }),
};

// Mayo 2026: dia 1 cae en viernes, 4 vacios iniciales
const calDays = [null,null,null,null,...Array.from({length:31},(_,i)=>i+1)];
const eventDays = [28];
const todayDay  = 26;

const eventos = [
  { dia:"26", mes:"May", titulo:"Hoy — Revisión de reportes",       desc:"Revisión de reportes pendientes de calificaciones.",  color:"blue",   tipo:"Académico"    },
  { dia:"28", mes:"May", titulo:"Inicio período académico",          desc:"Apertura oficial del nuevo período académico 2026-2.",color:"green",  tipo:"Institucional" },
  { dia:"02", mes:"Jun", titulo:"Entrega de reportes",               desc:"Fecha límite para entrega de informes docentes.",     color:"yellow", tipo:"Administrativo"},
  { dia:"10", mes:"Jun", titulo:"Reunión de docentes",               desc:"Reunión ordinaria de planta docente — Sala principal.",color:"blue",  tipo:"Reunión"      },
  { dia:"15", mes:"Jun", titulo:"Cierre de matrículas",              desc:"Fecha límite para completar matrículas del período.", color:"red",    tipo:"Administrativo"},
  { dia:"20", mes:"Jun", titulo:"Evaluaciones parciales",            desc:"Inicio de período de evaluaciones parciales.",        color:"yellow", tipo:"Académico"    },
];

const CalendarioAdmin = () => {
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.title}>Calendario Académico</div>
      <div style={styles.sub}>Gestión de eventos y fechas importantes del período</div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.calNav}>
            <span style={styles.calMonth}>Mayo 2026</span>
            <div style={{ display:"flex", gap:"6px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"10.5px", color:"#6b7280" }}>
                <div style={{ width:"10px",height:"10px",borderRadius:"2px",background:"#1e40af" }}/> Hoy
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"10.5px", color:"#6b7280" }}>
                <div style={{ width:"10px",height:"10px",borderRadius:"2px",background:"#eff6ff",border:"1px solid #bfdbfe" }}/> Evento
              </div>
            </div>
          </div>

          <div style={styles.calGrid}>
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d => (
              <div key={d} style={styles.calDayName}>{d}</div>
            ))}
            {calDays.map((day, i) => (
              <div
                key={i}
                style={{ position:"relative" }}
                onClick={() => day && eventDays.includes(day) && setEventoSeleccionado(day)}
              >
                <div style={styles.calDay(day===todayDay, eventDays.includes(day), day===null, false)}>
                  {day !== null ? day : ""}
                  {day && eventDays.includes(day) && day !== todayDay && (
                    <div style={styles.calDot} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:"16px", paddingTop:"12px", borderTop:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px" }}>
              Próximos meses
            </div>
            {["Junio 2026","Julio 2026","Agosto 2026"].map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #f9fafb", fontSize:"12.5px", color:"#374151" }}>
                <span>{m}</span>
                <span style={{ fontSize:"11px", color:"#9ca3af" }}>{[4,2,3][i]} eventos</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              Próximos Eventos
              <span style={{ fontSize:"10px", background:"#eff6ff", color:"#1e40af", padding:"1px 7px", borderRadius:"4px", border:"1px solid #bfdbfe", fontWeight:700, textTransform:"none", letterSpacing:0 }}>
                {eventos.length} eventos
              </span>
            </div>
            {eventos.map((e, i) => (
              <div key={i} style={styles.eventItem(e.color)}>
                <div style={styles.eventDateBox(e.color)}>
                  <div style={styles.eventDay}>{e.dia}</div>
                  <div style={styles.eventMonth}>{e.mes}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={styles.eventTitle}>{e.titulo}</div>
                  <div style={styles.eventDesc}>{e.desc}</div>
                  <div style={{ marginTop:"5px" }}>
                    <span style={styles.badge(e.color)}>{e.tipo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioAdmin;
