import React, { useState } from "react";

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
  bar: (pct,color="#1e40af") => ({
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
};

const estudiantes = [
  { nombre:"Ana García",    curso:"Matemáticas I",      nota:9.8, asistencia:98, pct:98, estado:"Excelente" },
  { nombre:"Carlos Mora",   curso:"Física Básica",      nota:9.5, asistencia:95, pct:95, estado:"Excelente" },
  { nombre:"Lucía Ramos",   curso:"Historia Universal", nota:9.2, asistencia:92, pct:92, estado:"Excelente" },
  { nombre:"Sofía Castro",  curso:"Inglés Intermedio",  nota:8.8, asistencia:90, pct:88, estado:"Bueno"     },
  { nombre:"Diego Herrera", curso:"Matemáticas I",      nota:8.5, asistencia:88, pct:85, estado:"Bueno"     },
  { nombre:"Valeria López", curso:"Programación I",     nota:8.1, asistencia:85, pct:81, estado:"Bueno"     },
  { nombre:"Miguel Torres", curso:"Física Básica",      nota:7.6, asistencia:80, pct:76, estado:"Regular"   },
  { nombre:"Paula Díaz",    curso:"Historia Universal", nota:7.2, asistencia:78, pct:72, estado:"Regular"   },
];

const cursos = [
  { nombre:"Matemáticas I",      docente:"Dr. Torres",  promedio:8.7, alumnos:28, top:"Ana García"   },
  { nombre:"Física Básica",      docente:"Dra. Ramos",  promedio:8.2, alumnos:22, top:"Carlos Mora"  },
  { nombre:"Historia Universal", docente:"Lic. Vargas", promedio:8.5, alumnos:31, top:"Lucía Ramos"  },
  { nombre:"Inglés Intermedio",  docente:"Prof. Díaz",  promedio:7.9, alumnos:18, top:"Sofía Castro" },
  { nombre:"Programación I",     docente:"Ing. Pérez",  promedio:7.4, alumnos:15, top:"Valeria López"},
];

const RendimientoAdmin = () => {
  const [vista, setVista] = useState("estudiantes");

  const colorNota = (n) => n >= 9 ? "green" : n >= 7.5 ? "blue" : n >= 6 ? "yellow" : "red";

  return (
    <div style={styles.page}>
      <div style={styles.title}>Rendimiento Académico</div>
      <div style={styles.sub}>Seguimiento del desempeño de estudiantes y cursos</div>

      <div style={styles.statsRow}>
        {[
          { label:"Promedio general",    value:"8.4",                                      icon:"📊", color:"#1e40af" },
          { label:"Estudiantes activos", value:estudiantes.length,                         icon:"🎓", color:"#15803d" },
          { label:"Con nota ≥ 9.0",      value:estudiantes.filter(e=>e.nota>=9).length,    icon:"⭐", color:"#d97706" },
          { label:"Cursos evaluados",    value:cursos.length,                              icon:"📚", color:"#7c3aed" },
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
                      <div style={styles.bar(e.pct)}>
                        <div style={styles.barFill(e.pct)} />
                      </div>
                      <span style={{ fontSize:"10.5px", color:"#6b7280" }}>{e.pct}%</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(e.estado==="Excelente"?"green":e.estado==="Bueno"?"blue":"yellow")}>
                      {e.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vista === "cursos" && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Rendimiento por Curso
            <span style={styles.badge("blue")}>{cursos.length} cursos</span>
          </div>
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
                      <div style={styles.bar(c.promedio*10)}>
                        <div style={styles.barFill(c.promedio*10)} />
                      </div>
                      <span style={{ fontSize:"10.5px", color:"#6b7280" }}>{c.promedio*10}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RendimientoAdmin;
