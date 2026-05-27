import React from "react";
import { gradientBanner } from "../../theme";

const styles = {
  banner: {
    background:     gradientBanner,
    borderRadius:   "12px",
    padding:        "22px 28px",
    marginBottom:   "20px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    flexWrap:       "wrap",
    gap:            "12px",
  },
  izquierda: {
    display:    "flex",
    alignItems: "center",
    gap:        "16px",
  },
  iconoBox: {
    width:          "52px",
    height:         "52px",
    borderRadius:   "12px",
    background:     "rgba(255,255,255,0.15)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "24px",
    flexShrink:     0,
  },
  titulo: {
    color:      "#fff",
    fontSize:   "20px",
    fontWeight: 700,
    margin:     0,
  },
  subtitulo: {
    color:     "rgba(255,255,255,0.75)",
    fontSize:  "13px",
    marginTop: "4px",
  },
};

const BannerPage = ({ icono, titulo, subtitulo, extra }) => {
  return (
    <div style={styles.banner}>
      <div style={styles.izquierda}>
        <div style={styles.iconoBox}>{icono}</div>
        <div>
          <h1 style={styles.titulo}>{titulo}</h1>
          {subtitulo && <p style={styles.subtitulo}>{subtitulo}</p>}
        </div>
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
};

export default BannerPage;
