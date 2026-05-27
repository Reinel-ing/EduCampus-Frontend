import React, { useState, useEffect } from "react";
import dashStyles from "../../styles/Dashboards.module.css";
const API = import.meta.env.VITE_API_BASE_URL;

const styles = {
  page:  { padding:"22px 24px", background:"#f0f4f8", minHeight:"100%", boxSizing:"border-box" },
  title: { fontSize:"18px", fontWeight:800, color:"#0f2744", marginBottom:"3px" },
  sub:   { fontSize:"12.5px", color:"#6b7280", marginBottom:"18px" },
  statsRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"14px" },
  statCard: (color="#1e40af") => ({
    background:"#fff", borderRadius:"10px", padding:"14px 16px",
    border:"1px solid #dde3ec", borderLeft:`4px solid ${color}`,
    display:"flex", alignItems:"center", gap:"12px",
  }),
  statIcon: { width:"38px",height:"38px",borderRadius:"8px",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0 },
  statNum:  { fontSize:"22px",fontWeight:800,color:"#0f2744",lineHeight:1 },
  statLbl:  { fontSize:"11px",color:"#6b7280",marginTop:"2px" },
  card:  { background:"#fff",borderRadius:"10px",border:"1px solid #dde3ec",padding:"16px",marginBottom:"12px" },
  cardTitle: {
    fontSize:"11px",fontWeight:700,color:"#0f2744",
    textTransform:"uppercase",letterSpacing:"0.6px",
    marginBottom:"12px",paddingBottom:"8px",
    borderBottom:"1px solid #f3f4f6",
    display:"flex",alignItems:"center",justifyContent:"space-between",
  },
  tabs: { display:"flex",gap:"6px",marginBottom:"14px" },
  tab: (active) => ({
    padding:"6px 14px",borderRadius:"6px",fontSize:"12px",fontWeight:600,
    cursor:"pointer",border:"1px solid",
    background: active?"#1e40af":"#fff",
    color:      active?"#fff":"#6b7280",
    borderColor: active?"#1e40af":"#dde3ec",
  }),
  table:  { width:"100%",borderCollapse:"collapse",fontSize:"12.5px" },
  th: { textAlign:"left",padding:"8px 12px",background:"#f8fafc",color:"#374151",fontWeight:700,fontSize:"11px",borderBottom:"1px solid #e5e9f0" },
  td: { padding:"10px 12px",borderBottom:"1px solid #f3f4f6",color:"#374151",verticalAlign:"middle" },
  rank: (i) => ({
    width:"22px",height:"22px",borderRadius:"5px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,
    background: i===0?"#fef9c3":i===1?"#f1f5f9":i===2?"#fff7ed":"#f9fafb",
    color:      i===0?"#b45309":i===1?"#475569":i===2?"#c2410c":"#6b7280",
  }),
  bar: () => ({
    height:"6px",background:"#f1f5f9",borderRadius:"3px",overflow:"hidden",
    position:"relative",width:"80px",display:"inline-block",verticalAlign:"middle",
  }),
  barFill: (pct,color="#1e40af") => ({ height:"100%",width:`${pct}%`,background:color,borderRadius:"3px" }),
  badge: (color) => ({
    fontSize:"9.5px",fontWeight:700,padding:"2px 8px",borderRadius:"4px",
    background: color==="green"?"#f0fdf4":color==="red"?"#fef2f2":color==="yellow"?"#fffbeb":"#eff6ff",
    color:      color==="green"?"#15803d":color==="red"?"#dc2626":color==="yellow"?"#d97706":"#1e40af",
    border:`1px solid ${color==="green"?"#bbf7d0":color==="red"?"#fecaca":color==="yellow"?"#fde68a":"#bfdbfe"}`,
  }),
  empty: { textAlign:"center",padding:"32px",color:"#9ca3af",fontSize:"13px" },
};

const colorEstado = (e) => e==="Excelente"?"green":e==="Bueno"?"blue":e==="Regular"?"yellow":"red";

const RendimientoAdmin = () => {
  const [vista, setVista] = useState("estudiantes");
  const [data, setData] = useState({ promedio_general:0, estudiantes:[], cursos:[] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API}/dashboard/rendimiento`)
      .then(r => r.json())
      .then(d => { setData(d); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const { promedio_general, estudiantes, cursos } = data;

  return (
    <div className={dashStyles.page}>
      <div style={styles.title}>Rendimiento Academico</div>
      <div style={styles.sub}>Seguimiento del desempeno de estudiantes y cursos</div>

      <div className={dashStyles.statsRow4}>
        {[
          { label:"Promedio general",    value: cargando ? "..." : promedio_general, icon:"📊", color:"#1e40af" },
          { label:"Estudiantes activos", value: cargando ? "..." : estudiantes.length, icon:"🎓", color:"#15803d" },
          { label:"Con nota >= 4.5",     value: cargando ? "..." : estudiantes.filter(e=>e.nota>=4.5).length, icon:"⭐", color:"#d97706" },
          { label:"Cursos evaluados",    value: cargando ? "..." : cursos.length, icon:"📚", color:"#7c3aed" },
        ].map((s,i) => (
          <div key={i} style={styles.statCard(s.color)}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div>
              <div style={styles.statNum}>{s.value}</div>
              <div style={styles.statLbl}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(vista==="estudiantes")} onClick={()=>setVista("estudiantes")}>Por Estudiante</button>
        <button style={styles.tab(vista==="cursos")}      onClick={()=>setVista("cursos")}>Por Curso</button>
      </div>

      {vista === "estudiantes" && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Ranking de Estudiantes
            <span style={styles.badge("blue")}>{estudiantes.length} estudiantes</span>
          </div>
          {cargando ? (
            <div style={styles.empty}>Cargando...</div>
          ) : estudiantes.length === 0 ? (
            <div style={styles.empty}>No hay datos de rendimiento aun.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Estudiante</th>
                  <th style={styles.th}>Curso</th>
                  <th style={styles.th}>Nota</th>
                  <th style={styles.th}>Asistencia</th>
                  <th style={styles.th}>Progreso</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e, i) => (
                  <tr key={i}>
                    <td style={styles.td}><span style={styles.rank(i)}>#{i+1}</span></td>
                    <td style={styles.td}><strong>{e.nombre}</strong></td>
                    <td style={styles.td}>{e.curso}</td>
                    <td style={styles.td}><strong style={{ fontSize:"14px", color:"#0f2744" }}>{e.nota}</strong></td>
                    <td style={styles.td}>{e.asistencia}%</td>
                    <td style={styles.td}>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                        <div style={styles.bar()}>
                          <div style={styles.barFill(e.pct)} />
                        </div>
                        <span style={{ fontSize:"10.5px", color:"#6b7280" }}>{e.pct}%</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(colorEstado(e.estado))}>{e.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}

      {vista === "cursos" && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Rendimiento por Curso
            <span style={styles.badge("blue")}>{cursos.length} cursos</span>
          </div>
          {cargando ? (
            <div style={styles.empty}>Cargando...</div>
          ) : cursos.length === 0 ? (
            <div style={styles.empty}>No hay datos de cursos aun.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Curso</th>
                  <th style={styles.th}>Docente</th>
                  <th style={styles.th}>Promedio</th>
                  <th style={styles.th}>Alumnos</th>
                  <th style={styles.th}>Mejor estudiante</th>
                  <th style={styles.th}>Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((c, i) => (
                  <tr key={i}>
                    <td style={styles.td}><strong>{c.nombre}</strong></td>
                    <td style={styles.td}>{c.docente}</td>
                    <td style={styles.td}><strong style={{ fontSize:"14px", color:"#0f2744" }}>{c.promedio}</strong></td>
                    <td style={styles.td}>{c.alumnos}</td>
                    <td style={styles.td}>{c.top}</td>
                    <td style={styles.td}>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                        <div style={styles.bar()}>
                          <div style={styles.barFill(c.promedio * 20)} />
                        </div>
                        <span style={{ fontSize:"10.5px", color:"#6b7280" }}>{Math.round(c.promedio * 20)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RendimientoAdmin;
