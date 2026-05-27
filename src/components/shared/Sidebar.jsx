/**
 * Sidebar.jsx
 * Barra de navegación lateral compartida por los tres roles del sistema.
 *
 * Responsabilidades:
 * - Renderiza el menú agrupado según el rol (admin / docente / estudiante).
 * - Muestra un badge rojo en "Notificaciones" con el conteo de no leídas.
 * - El badge se actualiza cada 30 segundos en segundo plano.
 * - En móvil se oculta con overlay y se abre/cierra con el botón hamburguesa.
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ADMIN_ROUTES, DOCENTE_ROUTES, USUARIO_ROUTES } from "../../constant/routes";
import { useAuth } from "../../context/AuthContext";
import { contarNoLeidas } from "../../services/notificacionesService";
import "../../styles/Sidebar.css";


// Definición de menús por rol
// Cada grupo tiene una etiqueta de sección y un array de ítems de navegación.
const menuAdmin = [
  {
    label: "Principal",
    items: [
      { icon: "🏠", label: "Inicio",       path: ADMIN_ROUTES.DASHBOARD    },
      { icon: "👥", label: "Usuarios",      path: ADMIN_ROUTES.USUARIOS     },
      { icon: "📚", label: "Cursos",        path: ADMIN_ROUTES.CURSOS       },
      { icon: "📋", label: "Matrículas",    path: ADMIN_ROUTES.MATRICULAS   },
    ],
  },
  {
    label: "Académico",
    items: [
      { icon: "📊", label: "Rendimiento",   path: ADMIN_ROUTES.RENDIMIENTO  },
      { icon: "📅", label: "Calendario",    path: ADMIN_ROUTES.CALENDARIO   },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { icon: "🔔", label: "Notificaciones", path: ADMIN_ROUTES.NOTIFICACIONES, badge: true },
      { icon: "⚠️", label: "Alertas y Tareas", path: ADMIN_ROUTES.ALERTAS  },
      { icon: "📈", label: "Reportes",      path: ADMIN_ROUTES.REPORTES     },
      { icon: "⚙️", label: "Configuración", path: ADMIN_ROUTES.CONFIGURACION },
    ],
  },
];

const menuDocente = [
  {
    label: "Principal",
    items: [
      { icon: "🏠", label: "Inicio",         path: DOCENTE_ROUTES.DASHBOARD      },
      { icon: "📚", label: "Mis Cursos",      path: DOCENTE_ROUTES.CURSOS         },
      { icon: "👥", label: "Estudiantes",     path: DOCENTE_ROUTES.ESTUDIANTES    },
    ],
  },
  {
    label: "Académico",
    items: [
      { icon: "📅", label: "Asistencia",       path: DOCENTE_ROUTES.ASISTENCIA     },
      { icon: "📝", label: "Calificaciones",   path: DOCENTE_ROUTES.CALIFICACIONES },
      { icon: "📁", label: "Material Didáctico", path: DOCENTE_ROUTES.MATERIAL     },
      { icon: "🗓️", label: "Calendario",       path: DOCENTE_ROUTES.CALENDARIO     },
      { icon: "📋", label: "Actividades",      path: DOCENTE_ROUTES.ACTIVIDADES    },
      { icon: "🔔", label: "Notificaciones",   path: DOCENTE_ROUTES.NOTIFICACIONES, badge: true },
    ],
  },
];

const menuEstudiante = [
  {
    label: "Principal",
    items: [
      { icon: "🏠", label: "Inicio",         path: USUARIO_ROUTES.DASHBOARD      },
      { icon: "📚", label: "Mis Cursos",      path: USUARIO_ROUTES.CURSOS         },
    ],
  },
  {
    label: "Académico",
    items: [
      { icon: "📝", label: "Calificaciones",  path: USUARIO_ROUTES.CALIFICACIONES },
      { icon: "📅", label: "Asistencia",      path: USUARIO_ROUTES.ASISTENCIA     },
      { icon: "🗓️", label: "Calendario",      path: USUARIO_ROUTES.CALENDARIO     },
      { icon: "📆", label: "Horario",         path: USUARIO_ROUTES.HORARIO        },
      { icon: "📂", label: "Materiales",      path: USUARIO_ROUTES.MATERIALES     },
      { icon: "📋", label: "Actividades",     path: USUARIO_ROUTES.ACTIVIDADES    },
      { icon: "🔔", label: "Notificaciones",  path: USUARIO_ROUTES.NOTIFICACIONES, badge: true },
    ],
  },
];

const rolLabel = { admin: "Administrador", docente: "Docente", estudiante: "Estudiante" };
const tipoMap  = { admin: "admin", docente: "docente", estudiante: "estudiante" };


const Sidebar = ({ userType = "admin" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cerrarSesion, usuario } = useAuth();

  const [isOpen,   setIsOpen]   = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);

  // Actualiza el badge de notificaciones cada 30 segundos
  useEffect(() => {
    if (!usuario?.id) return;
    const tipo = tipoMap[userType];
    if (!tipo) return;

    const fetchCount = async () => {
      const count = await contarNoLeidas(tipo, usuario.id);
      setNoLeidas(count);
    };

    fetchCount();
    const intervalo = setInterval(fetchCount, 30_000);
    return () => clearInterval(intervalo);
  }, [usuario, userType]);

  const menuGroups =
    userType === "docente"    ? menuDocente
    : userType === "estudiante" ? menuEstudiante
    : menuAdmin;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <>
      {/* Botón hamburguesa (visible solo en móvil vía CSS) */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", top: "1rem", left: "1rem", zIndex: 1001,
          background: "#0f2744", border: "none", borderRadius: "0.5rem",
          padding: "0.75rem", color: "white", fontSize: "1.25rem",
          cursor: "pointer", display: "none",
        }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay oscuro al abrir en móvil */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999, display: "none",
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo e identidad */}
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <img src="/logo_educampus.png" alt="EduCampus" className="sidebar-logo-img" />
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-title">EduCampus</span>
            <span className="sidebar-role">{rolLabel[userType]}</span>
          </div>
        </div>

        {/* Navegación agrupada por sección */}
        <nav className="sidebar-nav">
          {menuGroups.map((grupo, gi) => (
            <div key={gi} className="sidebar-nav-group">
              <span className="sidebar-nav-label">{grupo.label}</span>
              {grupo.items.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="sidebar-link-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>

                  {/* Badge de notificaciones no leídas */}
                  {item.badge && noLeidas > 0 && (
                    <span style={{
                      background: "#ef4444", color: "#fff",
                      borderRadius: "20px", fontSize: "10px", fontWeight: 700,
                      padding: "1px 7px", minWidth: "18px", textAlign: "center",
                    }}>
                      {noLeidas > 99 ? "99+" : noLeidas}
                    </span>
                  )}
                </Link>
              ))}
            </div>
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
