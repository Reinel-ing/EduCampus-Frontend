import React, { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../services/dashboardService";

const DashboardAdminPage = () => {
  const [stats, setStats] = useState({
    total_estudiantes: 0,
    total_docentes: 0,
    total_cursos: 0,
    cursos_activos: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            border: "5px solid #e2e8f0",
            borderTopColor: "#4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
<div
  style={{
    
    padding: "2rem",
    background: "#eef1f5",
    minHeight: "100vh",
    boxSizing: "border-box",
  }}
>


      {/* TITULO */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#111827",
            marginBottom: ".7rem",
          }}
        >
          Bienvenido al Panel de Administración
        </h2>

        <div
          style={{
            height: "3px",
            background: "#4f46e5",
            borderRadius: "999px",
            width: "100%",
          }}
        />
      </div>

      {/* TARJETAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "TOTAL USUARIOS",
            value: stats.total_estudiantes + stats.total_docentes,
            icon: "👥",
          },
          {
            label: "CURSOS ACTIVOS",
            value: stats.cursos_activos,
            icon: "📚",
          },
          {
            label: "DOCENTES",
            value: stats.total_docentes,
            icon: "👨‍🏫",
          },
          {
            label: "ESTUDIANTES",
            value: stats.total_estudiantes,
            icon: "🎓",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 3px 12px rgba(0,0,0,.06)",
              borderTop: "4px solid #4f46e5",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              {stat.icon}
            </div>

            <p
              style={{
                color: "#64748b",
                fontWeight: "600",
                letterSpacing: "1px",
                marginBottom: ".7rem",
              }}
            >
              {stat.label}
            </p>

            <h2
              style={{
                color: "#4f46e5",
                fontWeight: "800",
                fontSize: "2.5rem",
                margin: 0,
              }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

     {/* CONTENIDO PRINCIPAL */}
      <div
         style={{
         display: "grid",
         width: "100%",
         gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
         gap: "1.5rem",
       }}
      >
        {/* ACTIVIDAD RECIENTE */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "2rem",
            boxShadow: "0 3px 12px rgba(0,0,0,.06)",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#111827",
            }}
          >
            📋 Actividad Reciente
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {[
              {
                text: "Nuevo usuario registrado",
                time: "Hace 5 min",
                icon: "👤",
              },
              {
                text: "Curso actualizado",
                time: "Hace 20 min",
                icon: "📚",
              },
              {
                text: "Calificaciones subidas",
                time: "Hace 1 hora",
                icon: "📝",
              },
              {
                text: "Nueva matrícula registrada",
                time: "Hace 2 horas",
                icon: "🎓",
              },
              {
                text: "Configuración actualizada",
                time: "Hace 3 horas",
                icon: "⚙️",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  {item.icon}
                </div>

                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: ".2rem",
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>

                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: ".9rem",
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESO DE CURSOS */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "2rem",
            boxShadow: "0 3px 12px rgba(0,0,0,.06)",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "#111827",
            }}
          >
            📊 Progreso de Cursos
          </h3>

          {[
            {
              curso: "Programación Web",
              docente: "María López",
              progreso: 75,
            },
            {
              curso: "Matemáticas Avanzadas",
              docente: "Jose Castro",
              progreso: 60,
            },
            {
              curso: "Base de Datos",
              docente: "Jose Castro",
              progreso: 90,
            },
            {
              curso: "Diseño UX/UI",
              docente: "María López",
              progreso: 45,
            },
          ].map((curso, i) => (
            <div key={i} style={{ marginBottom: "1.7rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: ".5rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {curso.curso}
                  </p>

                  <span
                    style={{
                      fontSize: ".9rem",
                      color: "#6b7280",
                    }}
                  >
                    👨‍🏫 {curso.docente}
                  </span>
                </div>

                <span
                  style={{
                    fontWeight: "700",
                    color: "#4f46e5",
                  }}
                >
                  {curso.progreso}%
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${curso.progreso}%`,
                    height: "100%",
                    background: "#4f46e5",
                    borderRadius: "999px",
                  }}
                />
              </div>
            </div>
          ))}

          <button
            style={{
              marginTop: "1rem",
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Ver Reportes Completos →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminPage;