import React from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Header.css";

const Header = ({ title = "Panel de Administración" }) => {
  const { usuario } = useAuth();

  return (
    <header className="app-header">
      <span className="app-header-title">{title}</span>

      <div className="app-header-right">
        <span className="app-header-status">● En línea</span>
        <div className="app-header-user">
          <div className="app-header-avatar">
            {usuario?.nombres?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span className="app-header-name">
            {usuario?.nombres || "Usuario"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
