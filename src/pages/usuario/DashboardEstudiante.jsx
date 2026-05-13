import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEstudianteDashboardStats } from "../../services/dashboardService";
import { obtenerProximasClasesEstudiante } from "../../services/estudianteService";

const DashboardEstudiante = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ mis_cursos: 0, mi_promedio: 0, mi_asistencia: 0 });
  const [proximasClases, setProximasClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, clasesData] = await Promise.all([
          getEstudianteDashboardStats(usuario.id),
          obtenerProximasClasesEstudiante(usuario.id),
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
        Bienvenido, {usuario?.nombres} {usuario?.apellidos}
      </h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Resumen de tu rendimiento académico
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "MIS CURSOS", value: stats.mis_cursos, icon: "📚" },
          { label: "PROMEDIO GRAL", value: (Number(stats.mi_promedio) * 20).toFixed(1), icon: "📊" },
          { label: "ASISTENCIA", value: `${(Number(stats.mi_asistencia) * 100).toFixed(0)}%`, icon: "✅" },
          { label: "ESTADO", value: "Activo", icon: "🏅", color: "#10b981" },
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
            <p style={{ fontSize: "1.75rem", fontWeight: 700, color: stat.color || "#667eea", margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Info + Próximas clases */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "1rem" }}>
            👤 Mi Información
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "📧 Email", value: usuario?.correo },
              { label: "📞 Teléfono", value: usuario?.telefono || "No registrado" },
              { label: "🎓 Estado", value: "Activo" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ color: "#64748b", fontSize: "0.875rem" }}>{item.label}</span>
                <span style={{ color: "#1e293b", fontWeight: 500, fontSize: "0.875rem" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "1rem" }}>
            📅 Próximas Clases Hoy
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
                  <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.875rem" }}>{clase.nombre_curso}</span>
                  <span style={{ color: "#667eea", fontWeight: 600, fontSize: "0.875rem" }}>{clase.dia} {clase.hora}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b", textAlign: "center", padding: "2rem", fontStyle: "italic" }}>
              No tienes clases hoy
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudiante;