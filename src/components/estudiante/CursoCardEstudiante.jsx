import React from "react";

const styles = {
  card: {
    background:    "#fff",
    borderRadius:  "12px",
    border:        "1px solid #dde3ec",
    overflow:      "hidden",
    display:       "flex",
    flexDirection: "column",
  },
  encabezado: {
    background: "linear-gradient(135deg, #0f2744 0%, #1e40af 100%)",
    padding:    "16px 20px",
  },
  nombre: {
    color:      "#fff",
    fontSize:   "16px",
    fontWeight: 700,
    margin:     0,
  },
  cuerpo: {
    padding: "16px 20px",
    flex:    1,
  },
  campo: {
    marginBottom: "10px",
  },
  etiqueta: {
    fontSize:      "10px",
    fontWeight:    700,
    color:         "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display:       "block",
    marginBottom:  "2px",
  },
  valor: {
    fontSize:   "13px",
    color:      "#374151",
    fontWeight: 500,
  },
  horarioItem: {
    fontSize:     "12px",
    color:        "#1e40af",
    background:   "#eff6ff",
    border:       "1px solid #bfdbfe",
    borderRadius: "6px",
    padding:      "3px 8px",
    display:      "inline-block",
    marginRight:  "6px",
    marginTop:    "4px",
    fontWeight:   600,
  },
  pie: {
    padding:   "12px 20px",
    borderTop: "1px solid #f3f4f6",
  },
  btnContenido: {
    width:        "100%",
    padding:      "10px",
    background:   "#1e40af",
    color:        "#fff",
    border:       "none",
    borderRadius: "8px",
    fontSize:     "13px",
    fontWeight:   700,
    cursor:       "pointer",
  },
};

// Acepta array de strings ("Lunes 08:00") o de objetos ({ dia, hora })
function formatearHorario(horario) {
  if (!horario || !Array.isArray(horario) || horario.length === 0) {
    return <span style={styles.valor}>No especificado</span>;
  }
  return (
    <div>
      {horario.map((h, i) => (
        <span key={i} style={styles.horarioItem}>
          {typeof h === "string" ? h : `${h.dia} ${h.hora}`}
        </span>
      ))}
    </div>
  );
}

const CursoCardEstudiante = ({ curso, onVerContenido }) => {
  const docente = curso.docente;

  return (
    <div style={styles.card}>
      <div style={styles.encabezado}>
        <h3 style={styles.nombre}>{curso.nombre}</h3>
      </div>

      <div style={styles.cuerpo}>
        <div style={styles.campo}>
          <span style={styles.etiqueta}>Profesor</span>
          <span style={styles.valor}>
            {docente ? `${docente.nombres} ${docente.apellidos}` : "No asignado"}
          </span>
        </div>

        <div style={styles.campo}>
          <span style={styles.etiqueta}>Especialidad</span>
          <span style={styles.valor}>{docente?.especialidad || "No especificada"}</span>
        </div>

        <div style={styles.campo}>
          <span style={styles.etiqueta}>Horario</span>
          {formatearHorario(curso.horario)}
        </div>
      </div>

      <div style={styles.pie}>
        <button style={styles.btnContenido} onClick={() => onVerContenido(curso)}>
          Ver Contenido
        </button>
      </div>
    </div>
  );
};

export default CursoCardEstudiante;
