import dashStyles from "../../styles/Dashboards.module.css";
import React, { useState, useEffect, useCallback } from "react";

import { useAuth }  from "../../context/AuthContext";
import BannerPage   from "../../components/estudiante/BannerPage";

const API = import.meta.env.VITE_API_BASE_URL;

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100vh" },

  card: {
    background:   "#fff",
    borderRadius: "12px",
    marginBottom: "14px",
    padding:      "20px 22px",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.07)",
    borderLeft:   "4px solid #1e40af",
  },
  cardTop:   { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" },
  cardTitle: { fontWeight: 700, fontSize: "15px", color: "#1e293b", margin: "0 0 4px" },
  cardCurso: { fontSize: "12px", color: "#64748b", margin: "0 0 6px" },
  cardDesc:  { fontSize: "13px", color: "#475569", lineHeight: 1.5 },
  meta:      { display: "flex", gap: "14px", marginTop: "10px", flexWrap: "wrap" },
  metaItem:  { fontSize: "11.5px", color: "#94a3b8" },
  actions:   { display: "flex", gap: "8px", flexShrink: 0 },

  btnDown: {
    background:   "#eff6ff",
    border:       "1px solid #bfdbfe",
    color:        "#1e40af",
    padding:      "6px 12px",
    borderRadius: "7px",
    cursor:       "pointer",
    fontSize:     "12px",
    fontWeight:   600,
  },
  btnDel: {
    background:   "#fef2f2",
    border:       "1px solid #fecaca",
    color:        "#dc2626",
    padding:      "6px 12px",
    borderRadius: "7px",
    cursor:       "pointer",
    fontSize:     "12px",
    fontWeight:   600,
  },
  btnEntregas: {
    background:   "#f0fdf4",
    border:       "1px solid #bbf7d0",
    color:        "#15803d",
    padding:      "6px 12px",
    borderRadius: "7px",
    cursor:       "pointer",
    fontSize:     "12px",
    fontWeight:   600,
  },

  empty: {
    textAlign:    "center",
    padding:      "60px 20px",
    background:   "#fff",
    borderRadius: "12px",
    color:        "#94a3b8",
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
    maxWidth:     "500px",
    maxHeight:    "90vh",
    overflowY:    "auto",
  },
  modalTitle: { fontSize: "17px", fontWeight: 700, color: "#1e293b", margin: "0 0 20px" },
  label:      { display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "5px" },
  input: {
    width:        "100%",
    padding:      "9px 12px",
    border:       "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize:     "13px",
    boxSizing:    "border-box",
    marginBottom: "14px",
  },
  textarea: {
    width:        "100%",
    padding:      "9px 12px",
    border:       "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize:     "13px",
    boxSizing:    "border-box",
    marginBottom: "14px",
    minHeight:    "80px",
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

  entregaRow: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "10px 0",
    borderBottom:   "1px solid #e2e8f0",
    gap:            "10px",
    flexWrap:       "wrap",
  },
  entregaNombre: { fontSize: "13px", color: "#374151", fontWeight: 600 },
  entregaFecha:  { fontSize: "11px", color: "#94a3b8" },
  notaBadge: (nota) => ({
    display:      "inline-flex",
    alignItems:   "center",
    gap:          "4px",
    background:   nota >= 3.0 ? "#f0fdf4" : "#fef2f2",
    border:       `1px solid ${nota >= 3.0 ? "#bbf7d0" : "#fecaca"}`,
    color:        nota >= 3.0 ? "#15803d" : "#dc2626",
    padding:      "3px 10px",
    borderRadius: "20px",
    fontSize:     "12px",
    fontWeight:   700,
  }),
  notaInput: {
    width:        "70px",
    padding:      "5px 8px",
    border:       "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize:     "13px",
    textAlign:    "center",
  },
  btnCalificar: {
    background:   "#1e40af",
    border:       "none",
    color:        "#fff",
    padding:      "5px 12px",
    borderRadius: "6px",
    cursor:       "pointer",
    fontSize:     "12px",
    fontWeight:   600,
  },

  btnNueva: {
    padding:      "9px 18px",
    background:   "rgba(255,255,255,0.18)",
    border:       "1px solid rgba(255,255,255,0.35)",
    borderRadius: "8px",
    color:        "#fff",
    fontWeight:   700,
    fontSize:     "13px",
    cursor:       "pointer",
  },
};

function formatFecha(f) {
  if (!f) return "Sin limite";
  return new Date(f).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ActividadesDocente() {
  const { usuario } = useAuth();
  const [actividades,   setActividades]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);
  const [entregasModal, setEntregasModal] = useState(null);
  const [cursos,        setCursos]        = useState([]);
  const [form,          setForm]          = useState({ titulo: "", descripcion: "", fecha_limite: "", id_curso: "" });
  const [archivo,       setArchivo]       = useState(null);
  const [guardando,     setGuardando]     = useState(false);
  const [notasInput,    setNotasInput]    = useState({});
  const [calificando,   setCalificando]   = useState(null);

  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      const respuesta = await fetch(`${API}/actividades/por-docente/${usuario.id}`);
      if (respuesta.ok) setActividades(await respuesta.json());
    } catch (error) {
      console.error("[ActividadesDocente] cargar:", error);
    }
    setLoading(false);
  }, [usuario]);

  const cargarCursos = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      const respuesta = await fetch(`${API}/cursos/por-docente/${usuario.id}`);
      if (respuesta.ok) setCursos(await respuesta.json());
    } catch (error) {
      console.error("[ActividadesDocente] cargarCursos:", error);
    }
  }, [usuario]);

  useEffect(() => { cargar(); cargarCursos(); }, [cargar, cargarCursos]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.id_curso) { alert("Completa titulo y curso"); return; }
    setGuardando(true);
    try {
      const fd = new FormData();
      fd.append("titulo", form.titulo);
      fd.append("descripcion", form.descripcion);
      fd.append("fecha_limite", form.fecha_limite || "");
      fd.append("id_curso", form.id_curso);
      if (archivo) fd.append("archivo", archivo);

      const respuesta = await fetch(`${API}/actividades/upload`, { method: "POST", body: fd });
      if (respuesta.ok) {
        setShowModal(false);
        setForm({ titulo: "", descripcion: "", fecha_limite: "", id_curso: "" });
        setArchivo(null);
        cargar();
      } else {
        const error = await respuesta.json();
        alert("Error: " + (error.detail || "No se pudo crear la actividad"));
      }
    } catch {
      alert("Error de conexion");
    }
    setGuardando(false);
  };

  const handleEliminar = async (id) => {
    if (!confirm("Eliminar esta actividad?")) return;
    await fetch(`${API}/actividades/${id}`, { method: "DELETE" });
    cargar();
  };

  const verEntregas = async (act) => {
    try {
      const respuesta = await fetch(`${API}/actividades/${act.id_actividad}/entregas`);
      const entregas  = respuesta.ok ? await respuesta.json() : [];
      setEntregasModal({ id: act.id_actividad, titulo: act.titulo, entregas });
      // precarga las notas existentes en los inputs
      const init = {};
      entregas.forEach((e) => { if (e.nota != null) init[e.id_entrega] = String(e.nota); });
      setNotasInput(init);
    } catch {
      setEntregasModal({ id: act.id_actividad, titulo: act.titulo, entregas: [] });
    }
  };

  const handleCalificar = async (idEntrega) => {
    const valor = parseFloat(notasInput[idEntrega]);
    if (isNaN(valor) || valor < 0 || valor > 5) {
      alert("Ingresa una nota valida entre 0.0 y 5.0");
      return;
    }
    setCalificando(idEntrega);
    try {
      const respuesta = await fetch(`${API}/actividades/entregas/${idEntrega}/calificar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota: valor }),
      });
      if (respuesta.ok) {
        setEntregasModal((prev) => ({
          ...prev,
          entregas: prev.entregas.map((e) =>
            e.id_entrega === idEntrega ? { ...e, nota: valor } : e
          ),
        }));
      } else {
        const error = await respuesta.json();
        alert("Error: " + (error.detail || "No se pudo calificar"));
      }
    } catch {
      alert("Error de conexion");
    }
    setCalificando(null);
  };

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
        titulo="Actividades"
        subtitulo={`${actividades.length} actividad${actividades.length !== 1 ? "es" : ""} publicada${actividades.length !== 1 ? "s" : ""}`}
        extra={
          <button style={styles.btnNueva} onClick={() => setShowModal(true)}>
            + Nueva Actividad
          </button>
        }
      />

      {actividades.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p>No has publicado actividades aun</p>
          <button style={{ ...styles.btnSubmit, marginTop: 16 }} onClick={() => setShowModal(true)}>
            Crear primera actividad
          </button>
        </div>
      ) : (
        actividades.map((act) => (
          <div key={act.id_actividad} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={{ flex: 1 }}>
                <p style={styles.cardTitle}>{act.titulo}</p>
                <p style={styles.cardCurso}>📚 {act.nombre_curso}</p>
                {act.descripcion && <p style={styles.cardDesc}>{act.descripcion}</p>}
                <div style={styles.meta}>
                  <span style={styles.metaItem}>📅 Limite: {formatFecha(act.fecha_limite)}</span>
                  <span style={styles.metaItem}>📤 {act.total_entregas} entrega{act.total_entregas !== 1 ? "s" : ""}</span>
                  {act.nombre_archivo && <span style={styles.metaItem}>📎 {act.nombre_archivo}</span>}
                </div>
              </div>
              <div style={styles.actions}>
                {act.archivo_url && (
                  <a href={act.archivo_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button style={styles.btnDown}>⬇ Guia</button>
                  </a>
                )}
                <button style={styles.btnEntregas} onClick={() => verEntregas(act)}>
                  📋 Entregas ({act.total_entregas})
                </button>
                <button style={styles.btnDel} onClick={() => handleEliminar(act.id_actividad)}>
                  🗑 Eliminar
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>📋 Nueva Actividad</h2>
            <form onSubmit={handleGuardar}>
              <label style={styles.label}>Titulo *</label>
              <input
                style={styles.input}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Nombre de la actividad"
                required
              />

              <label style={styles.label}>Descripcion</label>
              <textarea
                style={styles.textarea}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Instrucciones para los estudiantes..."
              />

              <label style={styles.label}>Curso *</label>
              <select
                style={styles.input}
                value={form.id_curso}
                onChange={(e) => setForm({ ...form, id_curso: e.target.value })}
                required
              >
                <option value="">-- Seleccionar curso --</option>
                {cursos.map((c) => (
                  <option key={c.id_curso} value={c.id_curso}>{c.nombre}</option>
                ))}
              </select>

              <label style={styles.label}>Fecha limite de entrega</label>
              <input
                type="date"
                style={styles.input}
                value={form.fecha_limite}
                onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
              />

              <label style={styles.label}>Archivo guia (PDF, Word, etc.)</label>
              <input
                type="file"
                style={{ ...styles.input, padding: "6px" }}
                onChange={(e) => setArchivo(e.target.files[0])}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button type="button" style={styles.btnCancel} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSubmit} disabled={guardando}>
                  {guardando ? "Publicando..." : "Publicar Actividad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {entregasModal && (
        <div style={styles.modal} onClick={() => setEntregasModal(null)}>
          <div style={{ ...styles.modalBox, maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>📤 Entregas — {entregasModal.titulo}</h2>

            {entregasModal.entregas.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "30px" }}>
                Ningun estudiante ha entregado aun
              </p>
            ) : (
              entregasModal.entregas.map((entrega) => (
                <div key={entrega.id_entrega} style={styles.entregaRow}>
                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <p style={styles.entregaNombre}>{entrega.nombre_estudiante}</p>
                    <p style={styles.entregaFecha}>
                      {entrega.fecha_entrega
                        ? new Date(entrega.fecha_entrega).toLocaleString("es-CO")
                        : ""}
                    </p>
                    {entrega.comentario && (
                      <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                        {entrega.comentario}
                      </p>
                    )}
                    {entrega.nota != null && (
                      <span style={styles.notaBadge(entrega.nota)}>
                        {Number(entrega.nota).toFixed(1)}/5.0
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <a href={entrega.archivo_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <button style={styles.btnDown}>⬇ Descargar</button>
                    </a>
                    <input
                      type="number"
                      min="0" max="5" step="0.1"
                      placeholder="0.0"
                      style={styles.notaInput}
                      value={notasInput[entrega.id_entrega] ?? ""}
                      onChange={(ev) =>
                        setNotasInput((prev) => ({ ...prev, [entrega.id_entrega]: ev.target.value }))
                      }
                    />
                    <button
                      style={styles.btnCalificar}
                      disabled={calificando === entrega.id_entrega}
                      onClick={() => handleCalificar(entrega.id_entrega)}
                    >
                      {calificando === entrega.id_entrega ? "..." : "✔ Nota"}
                    </button>
                  </div>
                </div>
              ))
            )}

            <div style={{ textAlign: "right", marginTop: "16px" }}>
              <button style={styles.btnCancel} onClick={() => setEntregasModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
