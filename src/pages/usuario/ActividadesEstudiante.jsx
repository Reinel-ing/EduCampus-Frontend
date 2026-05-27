import dashStyles from "../../styles/Dashboards.module.css";
import React, { useState, useEffect, useCallback } from "react";

import { useAuth }  from "../../context/AuthContext";
import BannerPage   from "../../components/estudiante/BannerPage";
import EstadoBadge  from "../../components/estudiante/EstadoBadge";

const API = import.meta.env.VITE_API_BASE_URL;

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100vh" },

  card: {
    background:   "#fff",
    borderRadius: "12px",
    marginBottom: "14px",
    padding:      "20px 22px",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.07)",
  },
  cardTop: {
    display:        "flex",
    alignItems:     "flex-start",
    justifyContent: "space-between",
    gap:            "12px",
    flexWrap:       "wrap",
  },
  cardTitle: { fontWeight: 700, fontSize: "15px", color: "#1e293b", margin: "0 0 4px" },
  cardCurso: { fontSize: "12px", color: "#64748b", margin: "0 0 6px" },
  cardDesc:  { fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: "0 0 10px" },
  badgesRow: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" },
  meta:      { display: "flex", gap: "14px", flexWrap: "wrap" },
  metaItem:  { fontSize: "11.5px", color: "#94a3b8" },
  actions:   { display: "flex", gap: "8px", flexShrink: 0, alignItems: "flex-start", flexWrap: "wrap" },

  btnDown: {
    background:     "#eff6ff",
    border:         "1px solid #bfdbfe",
    color:          "#1e40af",
    padding:        "7px 14px",
    borderRadius:   "7px",
    cursor:         "pointer",
    fontSize:       "12px",
    fontWeight:     600,
    textDecoration: "none",
    display:        "inline-block",
  },
  btnUpload: {
    background:   "#1e40af",
    border:       "none",
    color:        "#fff",
    padding:      "7px 14px",
    borderRadius: "7px",
    cursor:       "pointer",
    fontSize:     "12px",
    fontWeight:   600,
  },
  btnReplace: {
    background:   "#f0fdf4",
    border:       "1px solid #bbf7d0",
    color:        "#15803d",
    padding:      "7px 14px",
    borderRadius: "7px",
    cursor:       "pointer",
    fontSize:     "12px",
    fontWeight:   600,
  },

  modal: {
    position:       "fixed",
    inset:          0,
    background:     "rgba(0,0,0,0.5)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         1000,
  },
  modalBox: {
    background:   "#fff",
    borderRadius: "14px",
    padding:      "28px 30px",
    width:        "100%",
    maxWidth:     "440px",
  },
  modalTitle: { fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: "0 0 16px" },
  label:      { display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "5px" },
  fileInput: {
    width:        "100%",
    padding:      "9px 12px",
    border:       "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize:     "13px",
    boxSizing:    "border-box",
    marginBottom: "12px",
  },
  textarea: {
    width:        "100%",
    padding:      "9px 12px",
    border:       "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize:     "13px",
    boxSizing:    "border-box",
    marginBottom: "14px",
    minHeight:    "70px",
    resize:       "vertical",
  },
  btnSubmit: {
    background:   "#1e40af",
    color:        "#fff",
    border:       "none",
    padding:      "10px 24px",
    borderRadius: "8px",
    cursor:       "pointer",
    fontSize:     "13px",
    fontWeight:   700,
  },
  btnCancel: {
    background:   "#f1f5f9",
    color:        "#64748b",
    border:       "none",
    padding:      "10px 24px",
    borderRadius: "8px",
    cursor:       "pointer",
    fontSize:     "13px",
    fontWeight:   600,
    marginRight:  "8px",
  },

  empty: {
    textAlign:    "center",
    padding:      "60px 20px",
    background:   "#fff",
    borderRadius: "12px",
    color:        "#94a3b8",
  },
};

function formatFecha(f) {
  if (!f) return null;
  return new Date(f).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function estaVencida(fecha_limite) {
  if (!fecha_limite) return false;
  return new Date(fecha_limite) < new Date();
}

export default function ActividadesEstudiante() {
  const { usuario } = useAuth();
  const [actividades, setActividades] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modalAct,    setModalAct]    = useState(null);
  const [archivo,     setArchivo]     = useState(null);
  const [comentario,  setComentario]  = useState("");
  const [subiendo,    setSubiendo]    = useState(false);

  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      const respuesta = await fetch(`${API}/actividades/por-estudiante/${usuario.id}`);
      if (respuesta.ok) setActividades(await respuesta.json());
    } catch (error) {
      console.error("[ActividadesEstudiante]", error);
    }
    setLoading(false);
  }, [usuario]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!archivo) { alert("Selecciona un archivo"); return; }
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append("id_estudiante", usuario.id);
      fd.append("comentario", comentario);
      fd.append("archivo", archivo);

      const respuesta = await fetch(
        `${API}/actividades/${modalAct.id_actividad}/entregas/upload`,
        { method: "POST", body: fd }
      );

      if (respuesta.ok) {
        setModalAct(null);
        setArchivo(null);
        setComentario("");
        cargar();
      } else {
        const error = await respuesta.json();
        alert("Error: " + (error.detail || "No se pudo subir"));
      }
    } catch {
      alert("Error de conexion");
    }
    setSubiendo(false);
  };

  const pendientes = actividades.filter((a) => !a.entregado).length;

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#1e40af", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={dashStyles.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <BannerPage
        icono="📋"
        titulo="Mis Actividades"
        subtitulo={
          pendientes > 0
            ? `${pendientes} actividad${pendientes > 1 ? "es" : ""} pendiente${pendientes > 1 ? "s" : ""} de entrega`
            : "Todo entregado — buen trabajo"
        }
      />

      {actividades.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p>No hay actividades publicadas en tus cursos</p>
        </div>
      ) : (
        actividades.map((act) => {
          const vencida    = estaVencida(act.fecha_limite) && !act.entregado;
          const bordeColor = act.entregado ? "#15803d" : vencida ? "#dc2626" : "#d97706";

          return (
            <div
              key={act.id_actividad}
              style={{ ...styles.card, borderLeft: `4px solid ${bordeColor}` }}
            >
              <div style={styles.cardTop}>
                <div style={{ flex: 1 }}>
                  <div style={styles.badgesRow}>
                    <EstadoBadge
                      tipo={act.entregado ? "entregado" : vencida ? "vencido" : "pendiente"}
                    />
                    {act.entrega?.nota != null && (
                      <EstadoBadge tipo="nota" nota={act.entrega.nota} />
                    )}
                  </div>

                  <p style={styles.cardTitle}>{act.titulo}</p>
                  <p style={styles.cardCurso}>📚 {act.nombre_curso}</p>
                  {act.descripcion && <p style={styles.cardDesc}>{act.descripcion}</p>}

                  <div style={styles.meta}>
                    {act.fecha_limite && (
                      <span style={styles.metaItem}>📅 Límite: {formatFecha(act.fecha_limite)}</span>
                    )}
                    {act.entrega && (
                      <span style={styles.metaItem}>
                        📤 Entregado el {new Date(act.entrega.fecha_entrega).toLocaleDateString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>

                <div style={styles.actions}>
                  {act.archivo_url && (
                    <a href={act.archivo_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <span style={styles.btnDown}>⬇ Descargar Guía</span>
                    </a>
                  )}
                  {act.entrega && (
                    <a href={act.entrega.archivo_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <span style={styles.btnDown}>📄 Ver mi entrega</span>
                    </a>
                  )}
                  {!vencida && (
                    <button
                      style={act.entregado ? styles.btnReplace : styles.btnUpload}
                      onClick={() => setModalAct(act)}
                    >
                      {act.entregado ? "🔄 Reemplazar" : "📤 Entregar"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {modalAct && (
        <div style={styles.modal} onClick={() => setModalAct(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>📤 Entregar — {modalAct.titulo}</h2>
            <form onSubmit={handleSubir}>
              <label style={styles.label}>Archivo de entrega *</label>
              <input
                type="file"
                style={styles.fileInput}
                onChange={(e) => setArchivo(e.target.files[0])}
                required
              />
              <label style={styles.label}>Comentario (opcional)</label>
              <textarea
                style={styles.textarea}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agrega un comentario para tu docente..."
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" style={styles.btnCancel} onClick={() => setModalAct(null)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSubmit} disabled={subiendo}>
                  {subiendo ? "Subiendo..." : "Enviar Actividad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
