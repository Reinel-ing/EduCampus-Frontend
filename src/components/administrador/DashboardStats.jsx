import React from "react";
import StatCard from "./StatCard";

const DashboardStats = ({ stats }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-400 pb-2">
        Bienvenido al Panel de Administración
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TOTAL USUARIOS"
          value={stats.total_estudiantes + stats.total_docentes}
          icon="👥"
        />

        <StatCard
          title="CURSOS ACTIVOS"
          value={stats.cursos_activos}
          icon="📚"
        />

        <StatCard title="DOCENTES" value={stats.total_docentes} icon="👨‍🏫" />

        <StatCard
          title="ESTUDIANTES"
          value={stats.total_estudiantes}
          icon="🎓"
        />
      </div>
    </div>
  );
};

export default DashboardStats;
