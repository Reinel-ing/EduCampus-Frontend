import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTES,
  DOCENTE_ROUTES,
  USUARIO_ROUTES,
} from "../../constant/routes";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Sidebar.css";

const Sidebar = ({ userType = "admin" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const adminMenuItems = [
    { icon: "🏠", label: "Inicio", path: ADMIN_ROUTES.DASHBOARD },
    { icon: "👥", label: "Gestión de Usuarios", path: ADMIN_ROUTES.USUARIOS },
    { icon: "📚", label: "Gestión de Cursos", path: ADMIN_ROUTES.CURSOS },
    { icon: "📊", label: "Reportes", path: ADMIN_ROUTES.REPORTES },
    { icon: "⚙️", label: "Configuración", path: ADMIN_ROUTES.CONFIGURACION },
  ];

  const docenteMenuItems = [
  { icon: "🏠", label: "Inicio", path: DOCENTE_ROUTES.DASHBOARD },
  { icon: "📚", label: "Mis Cursos", path: DOCENTE_ROUTES.CURSOS },
  { icon: "👥", label: "Estudiantes", path: DOCENTE_ROUTES.ESTUDIANTES },
  { icon: "📅", label: "Asistencia", path: "/docente/asistencia" },
  { icon: "📝", label: "Calificaciones", path: "/docente/calificaciones" },
  { icon: "📁", label: "Material Didáctico", path: "/docente/material" },
  ];

  const estudianteMenuItems = [
  { icon: "🏠", label: "Inicio", path: USUARIO_ROUTES.DASHBOARD },
  { icon: "📚", label: "Mis Cursos", path: USUARIO_ROUTES.CURSOS },
  { icon: "📝", label: "Calificaciones", path: "/usuario/calificaciones" },
  { icon: "📅", label: "Asistencia", path: "/usuario/asistencia" },
  { icon: "🗓️", label: "Calendario", path: "/usuario/calendario" },
  { icon: "📆", label: "Horario", path: "/usuario/horario" },
  { icon: "📂", label: "Materiales", path: "/usuario/materiales" },
  ];

  const menuItems =
    userType === "docente"
      ? docenteMenuItems
      : userType === "estudiante"
      ? estudianteMenuItems
      : adminMenuItems;

  const roleLabel =
    userType === "docente"
      ? "Docente"
      : userType === "estudiante"
      ? "Estudiante"
      : "Administrador";

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1001,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "none",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
        }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: "none",
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <img
              src="/logo_educampus.png"
              alt="EduCampus Logo"
              className="sidebar-logo-img"
            />
          </div>
          <h1 className="sidebar-title">EduCampus</h1>
          <p className="sidebar-role">{roleLabel}</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="sidebar-logout-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;