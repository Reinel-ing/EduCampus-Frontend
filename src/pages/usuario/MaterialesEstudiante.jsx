import dashStyles from "../../styles/Dashboards.module.css";
import React, { useState, useEffect } from "react";

import { useAuth }                    from "../../context/AuthContext";
import { obtenerCursosPorEstudiante } from "../../services/cursoService";
import { obtenerMaterialPorCurso }    from "../../services/materialService";
import BannerPage from "../../components/estudiante/BannerPage";

const styles = {
  page: { padding: "22px 24px", background: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" },

  searchBox: {
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
    padding:      "10px 16px",
    marginBottom: "16px",
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
  },
  searchInput: {
    flex:       1,
    border:     "none",
    outline:    "none",
    fontSize:   "13px",
    color:      "#374151",
    background: "transparent",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px,1fr))", gap: "14px" },

  card: {
    background:    "#fff",
    borderRadius:  "10px",
    border:        "1px solid #dde3ec",
    overflow:      "hidden",
    display:       "flex",
    flexDirection: "column",
  },
  cardTop: {
    background:     "#eff6ff",
    padding:        "20px",
    textAlign:      "center",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            "8px",
  },
  docIcon: {
    width:          "52px",
    height:         "52px",
    borderRadius:   "12px",
    background:     "linear-gradient(135deg, #0f2744 0%, #1e40af 100%)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "22px",
  },
  cardBody:       { padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" },
  materialNombre: { fontSize: "13.5px", fontWeight: 700, color: "#0f2744", lineHeight: 1.3 },
  cursoTag: {
    display:      "inline-block",
    fontSize:     "10.5px",
    fontWeight:   700,
    color:        "#1e40af",
    background:   "#eff6ff",
    border:       "1px solid #bfdbfe",
    borderRadius: "5px",
    padding:      "2px 8px",
  },
  fecha: { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },

  downloadBtn: {
    margin:         "0 16px 16px",
    padding:        "9px 0",
    background:     "linear-gradient(135deg, #0f2744 0%, #1e40af 100%)",
    color:          "#fff",
    border:         "none",
    borderRadius:   "8px",
    fontSize:       "12.5px",
    fontWeight:     700,
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "6px",
  },

  empty: {
    textAlign:    "center",
    padding:      "50px 20px",
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
  },
};

const MaterialesEstudiante = () => {
  const { usuario } = useAuth();
  const [materiales, setMateriales] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const cursosData = await obtenerCursosPorEstudiante(usuario.id);
      if (!cursosData?.error && Array.isArray(cursosData)) {
        const resultados = await Promise.all(
          cursosData.map((c) => obtenerMaterialPorCurso(c.id_curso))
        );
        // aplanar y etiquetar cada material con el nombre del curso
        const todos = resultados.flatMap((mats, i) =>
          Array.isArray(mats) && !mats?.error
            ? mats.map((item) => ({ ...item, nombre_curso: cursosData[i].nombre }))
            : []
        );
        setMateriales(todos);
      }
    } catch (error) {
      console.error("[MaterialesEstudiante]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = (material) => {
    const link = document.createElement("a");
    link.href  = material.archivo_url;
    let nombre = material.nombre_archivo || "archivo";
    if (!nombre.toLowerCase().endsWith(".pdf")) nombre += ".pdf";
    link.download = nombre;
    link.target   = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtrados = materiales.filter(
    (m) =>
      m.nombre_archivo?.toLowerCase().includes(search.toLowerCase()) ||
      m.nombre_curso?.toLowerCase().includes(search.toLowerCase())
  );

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
        icono="📂"
        titulo="Mis Materiales"
        subtitulo={
          materiales.length > 0
            ? `${materiales.length} archivo${materiales.length !== 1 ? "s" : ""} disponible${materiales.length !== 1 ? "s" : ""}`
            : "Sin materiales disponibles aun"
        }
      />

      <div style={styles.searchBox}>
        <span style={{ color: "#9ca3af", fontSize: "15px" }}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Buscar por nombre o curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px", lineHeight: 1 }}
          >
            ✕
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📂</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f2744", marginBottom: "6px" }}>
            {search ? "Sin resultados" : "No hay materiales disponibles"}
          </div>
          <div style={{ fontSize: "12.5px", color: "#6b7280" }}>
            {search
              ? `No se encontraron materiales para "${search}"`
              : "Los docentes aun no han subido materiales a tus cursos"}
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtrados.map((m) => (
            <div key={m.id_material} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.docIcon}>📄</div>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.materialNombre}>{m.nombre_archivo}</div>
                <span style={styles.cursoTag}>{m.nombre_curso}</span>
                {m.fecha && (
                  <div style={styles.fecha}>
                    {new Date(m.fecha).toLocaleDateString("es-ES", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                )}
              </div>
              <button style={styles.downloadBtn} onClick={() => handleDescargar(m)}>
                📥 Descargar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialesEstudiante;
