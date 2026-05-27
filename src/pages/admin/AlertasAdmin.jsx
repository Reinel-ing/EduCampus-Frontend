import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../constant/routes";

const styles = {
  page:  { padding:"22px 24px", background:"#f0f4f8", minHeight:"100%", boxSizing:"border-box" },
  title: { fontSize:"18px", fontWeight:800, color:"#0f2744", marginBottom:"3px" },
  sub:   { fontSize:"12.5px", color:"#6b7280", marginBottom:"18px" },
  statsRow: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"14px" },
  statCard: (color) => ({
    background:"#fff", borderRadius:"10px", padding:"14px 16px",
    border:"1px solid #dde3ec", borderLeft:`4px solid ${color}`,
    display:"flex", alignItems:"center", gap:"12px",
  }),
  statIcon: { width:"36px",height:"36px",borderRadius:"8px",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0 },
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
  item: (tipo) => ({
    display:"flex",alignItems:"flex-start",gap:"12px",
    padding:"12px 14px",borderRadius:"8px",marginBottom:"8px",
    background: tipo==="urgente"?"#fef2f2":tipo==="advertencia"?"#fffbeb":"#eff6ff",
    border:`1px solid ${tipo==="urgente"?"#fecaca":tipo==="advertencia"?"#fde68a":"#bfdbfe"}`,
  }),
  dot: (tipo) => ({
    width:"8px",height:"8px",borderRadius:"50%",flexShrink:0,marginTop:"5px",
    background: tipo==="urgente"?"#dc2626":tipo==="advertencia"?"#f59e0b":"#1e40af",
  }),
  itemTitle: { fontSize:"13px",fontWeight:700,color:"#0f2744",marginBottom:"3px" },
  itemDesc:  { fontSize:"12px",color:"#6b7280",lineHeight:1.4,marginBottom:"6px" },
  actionBtn: (tipo) => ({
    padding:"4px 12px",borderRadius:"5px",fontSize:"11.5px",fontWeight:700,cursor:"pointer",border:"1px solid",
    background: tipo==="urgente"?"#dc2626":tipo==="advertencia"?"#d97706":"#1e40af",
    color:"#fff",
    borderColor: tipo==="urgente"?"#dc2626":tipo==="advertencia"?"#d97706":"#1e40af",
  }),
  badge: (tipo) => ({
    fontSize:"9.5px",fontWeight:700,padding:"2px 8px",borderRadius:"4px",whiteSpace:"nowrap",
    background: tipo==="urgente"?"#fef2f2":tipo==="advertencia"?"#fffbeb":"#eff6ff",
    color:      tipo==="urgente"?"#dc2626":tipo==="advertencia"?"#d97706":"#1e40af",
    border:`1px solid ${tipo==="urgente"?"#fecaca":tipo==="advertencia"?"#fde68a":"#bfdbfe"}`,
  }),
};

const alertas = [
  { id:1, tipo:"urgente",      titulo:"Docentes sin horario asignado",        desc:"3 docentes no tienen horario asignado para el periodo actual.",                         accion:"Ir a Usuarios",   ruta: ADMIN_ROUTES.USUARIOS      },
  { id:2, tipo:"urgente",      titulo:"Estudiantes sin matricula",             desc:"5 estudiantes estan registrados pero sin matricula activa para el periodo 2026-2.",    accion:"Ir a Matriculas", ruta: ADMIN_ROUTES.MATRICULAS    },
  { id:3, tipo:"advertencia",  titulo:"Periodo de matriculas por cerrar",      desc:"El periodo de matriculas cierra en 3 dias. Quedan solicitudes pendientes.",           accion:"Ver matriculas",  ruta: ADMIN_ROUTES.MATRICULAS    },
  { id:4, tipo:"advertencia",  titulo:"Solicitudes de apertura pendientes",    desc:"Hay 2 solicitudes de apertura de nuevos cursos pendientes de aprobacion.",            accion:"Ver cursos",      ruta: ADMIN_ROUTES.CURSOS        },
  { id:5, tipo:"advertencia",  titulo:"Materiales sin publicar",               desc:"4 docentes tienen materiales cargados pero no publicados para sus estudiantes.",      accion:"Ver reportes",    ruta: ADMIN_ROUTES.REPORTES      },
  { id:6, tipo:"informativo",  titulo:"Informe mensual disponible",            desc:"El informe de mayo esta listo para descargarse desde reportes.",                      accion:"Ver reportes",    ruta: ADMIN_ROUTES.REPORTES      },
  { id:7, tipo:"informativo",  titulo:"Nuevo docente pendiente de asignacion", desc:"Ing. Perez esta registrado como docente pero no tiene curso asignado.",               accion:"Ir a Usuarios",   ruta: ADMIN_ROUTES.USUARIOS      },
  { id:8, tipo:"informativo",  titulo:"Configuracion de periodo requerida",    desc:"El proximo periodo academico no tiene fechas configuradas.",                          accion:"Configuracion",   ruta: ADMIN_ROUTES.CONFIGURACION },
];

const AlertasAdmin = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("todas");

  const filtradas = alertas.filter(a =>
    filtro === "todas" ? true : a.tipo === filtro
  );

  return (
    <div style={styles.page}>
      <div style={styles.title}>Alertas y Tareas Pendientes</div>
      <div style={styles.sub}>Revisa y gestiona todas las acciones pendientes del sistema</div>

      <div style={styles.statsRow}>
        {[
          { label:"Urgentes",     value: alertas.filter(a=>a.tipo==="urgente").length,     icon:"🔴", color:"#dc2626" },
          { label:"Advertencias", value: alertas.filter(a=>a.tipo==="advertencia").length, icon:"🟡", color:"#d97706" },
          { label:"Informativos", value: alertas.filter(a=>a.tipo==="informativo").length, icon:"🔵", color:"#1e40af" },
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

      <div style={{ display:"flex",gap:"6px",marginBottom:"14px" }}>
        {[
          { key:"todas",       label:`Todas (${alertas.length})` },
          { key:"urgente",     label:"Urgentes" },
          { key:"advertencia", label:"Advertencias" },
          { key:"informativo", label:"Informativos" },
        ].map(t => (
          <button key={t.key}
            onClick={()=>setFiltro(t.key)}
            style={{ padding:"6px 14px",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer",border:"1px solid",
              background: filtro===t.key?"#1e40af":"#fff",
              color:      filtro===t.key?"#fff":"#6b7280",
              borderColor: filtro===t.key?"#1e40af":"#dde3ec" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>
          {filtro==="todas"?"Todas las alertas":filtro==="urgente"?"Alertas urgentes":filtro==="advertencia"?"Advertencias":"Informativos"}
          <span style={{ fontSize:"10px",background:"#eff6ff",color:"#1e40af",padding:"1px 7px",borderRadius:"4px",border:"1px solid #bfdbfe",fontWeight:700,textTransform:"none",letterSpacing:0 }}>
            {filtradas.length} items
          </span>
        </div>

        {filtradas.map(a => (
          <div key={a.id} style={styles.item(a.tipo)}>
            <div style={styles.dot(a.tipo)} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px" }}>
                <div style={styles.itemTitle}>{a.titulo}</div>
                <span style={styles.badge(a.tipo)}>{a.tipo.charAt(0).toUpperCase()+a.tipo.slice(1)}</span>
              </div>
              <div style={styles.itemDesc}>{a.desc}</div>
              <button style={styles.actionBtn(a.tipo)} onClick={()=>navigate(a.ruta)}>
                {a.accion} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertasAdmin;
