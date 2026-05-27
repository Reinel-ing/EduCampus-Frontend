import React from "react";
import EstadoBadge from "./EstadoBadge";

// Pesos: P1 30%, P2 30%, Final 40%
const PESOS = { parcial1: 0.3, parcial2: 0.3, final: 0.4 };

const styles = {
  card: {
    background:   "#fff",
    borderRadius: "10px",
    border:       "1px solid #dde3ec",
    overflow:     "hidden",
    marginBottom: "12px",
  },
  encabezado: {
    padding:        "12px 18px",
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    borderBottom:   "1px solid #f3f4f6",
  },
  nombre: {
    fontSize:   "14px",
    fontWeight: 700,
    color:      "#0f2744",
    margin:     0,
  },
  cuerpo: {
    display:             "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap:                 "1px",
    background:          "#f3f4f6",
  },
  celda: {
    background: "#fff",
    padding:    "12px 16px",
    textAlign:  "center",
  },
  celdaEtiqueta: {
    fontSize:      "10px",
    fontWeight:    700,
    color:         "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom:  "4px",
  },
  celdaNota: {
    fontSize:   "22px",
    fontWeight: 800,
    color:      "#0f2744",
    lineHeight: 1,
  },
  celdaPeso: {
    fontSize:  "10px",
    color:     "#9ca3af",
    marginTop: "3px",
  },
  pie: {
    padding:        "10px 18px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    borderTop:      "1px solid #f3f4f6",
    background:     "#fafafa",
  },
  promedioLabel: {
    fontSize:   "12px",
    color:      "#6b7280",
    fontWeight: 500,
  },
  promedioValor: {
    fontSize:   "18px",
    fontWeight: 800,
    color:      "#0f2744",
  },
};

// Retorna null si falta alguna nota (curso en progreso)
function calcularPromedio(p1, p2, fin) {
  if (p1 == null || p2 == null || fin == null) return null;
  return (Number(p1) * PESOS.parcial1 + Number(p2) * PESOS.parcial2 + Number(fin) * PESOS.final).toFixed(2);
}

function mostrarNota(nota) {
  return nota != null ? Number(nota).toFixed(1) : "—";
}

const NotaResumen = ({ nombreCurso, parcial1, parcial2, final }) => {
  const promedio = calcularPromedio(parcial1, parcial2, final);

  let estadoBadge = "en_progreso";
  if (promedio !== null) {
    estadoBadge = parseFloat(promedio) >= 3.0 ? "aprobado" : "reprobado";
  }

  return (
    <div style={styles.card}>
      <div style={styles.encabezado}>
        <h3 style={styles.nombre}>{nombreCurso}</h3>
        <EstadoBadge tipo={estadoBadge} />
      </div>

      <div style={styles.cuerpo}>
        <div style={styles.celda}>
          <div style={styles.celdaEtiqueta}>Parcial 1</div>
          <div style={styles.celdaNota}>{mostrarNota(parcial1)}</div>
          <div style={styles.celdaPeso}>Peso: 30%</div>
        </div>
        <div style={styles.celda}>
          <div style={styles.celdaEtiqueta}>Parcial 2</div>
          <div style={styles.celdaNota}>{mostrarNota(parcial2)}</div>
          <div style={styles.celdaPeso}>Peso: 30%</div>
        </div>
        <div style={styles.celda}>
          <div style={styles.celdaEtiqueta}>Final</div>
          <div style={styles.celdaNota}>{mostrarNota(final)}</div>
          <div style={styles.celdaPeso}>Peso: 40%</div>
        </div>
      </div>

      <div style={styles.pie}>
        <span style={styles.promedioLabel}>Promedio ponderado</span>
        <span style={styles.promedioValor}>
          {promedio !== null ? `${promedio} / 5.0` : "En progreso"}
        </span>
      </div>
    </div>
  );
};

export default NotaResumen;
