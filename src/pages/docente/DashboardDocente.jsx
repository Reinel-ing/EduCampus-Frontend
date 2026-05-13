import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDocenteDashboardStats } from "../../services/dashboardService";
import { obtenerProximasClases } from "../../services/cursoService";

const DashboardDocente = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ mis_cursos: 0, total_estudiantes: 0, material_subido: 0 });
  const [proximasClases, setProximasClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, clasesData] = await Promise.all([
          getDocenteDashboardStats(usuario.id),
          obtenerProximasClases(usuario.id),
        ]);
        setStats(statsData);
        if (!clasesData.error) setProximasClases(clasesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [usuario]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTopColor: "#667eea", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.25rem" }}>
        Bienvenido, {usuario?.nombres}
      </h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Resumen de tu actividad docente
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "MIS CURSOS", value: stats.mis_cursos, icon: "📚" },
          { label: "ESTUDIANTES", value: stats.total_estudiantes, icon: "👥" },
          { label: "MATERIALES", value: stats.material_subido, icon: "📁" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#667eea", margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Próximas Clases */}
      <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "1rem" }}>
          📅 Próximas Clases
        </h3>
        {proximasClases.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {proximasClases.map((clase, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "#f8fafc",
                borderRadius: "8px",
                borderLeft: "4px solid #667eea",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>📚</span>
                  <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>{clase.nombre_curso}</span>
                </div>
                <span style={{ color: "#667eea", fontWeight: 600, fontSize: "0.875rem" }}>
                  {clase.dia} {clase.hora}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#64748b", textAlign: "center", padding: "2rem", fontStyle: "italic" }}>
            No tienes clases programadas
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardDocente;