import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title = "Panel de Administración" }) => {
  const { usuario } = useAuth();

  return (
    <header style={{
      height: "54px",
      background: "#ffffff",
      borderBottom: "1px solid #dde3ec",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f2744" }}>
        {title}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{
          padding: "4px 11px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "6px",
          fontSize: "11.5px",
          color: "#15803d",
          fontWeight: 600,
        }}>
          ● En línea
        </span>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 12px 5px 6px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            background: "#0f2744",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 700,
          }}>
            {usuario?.nombres?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
            {usuario?.nombres || "Usuario"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
