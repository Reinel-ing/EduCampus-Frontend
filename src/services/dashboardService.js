const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAdminDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/admin`, {
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok)
    throw new Error("Error al obtener estadísticas del dashboard");
  return response.json();
};

export const getDocenteDashboardStats = async (docenteId) => {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/docente/${docenteId}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );
  if (!response.ok)
    throw new Error("Error al obtener estadísticas del docente");
  return response.json();
};

export const getEstudianteDashboardStats = async (estudianteId) => {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/estudiante/${estudianteId}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );
  if (!response.ok)
    throw new Error("Error al obtener estadísticas del estudiante");
  return response.json();
};
