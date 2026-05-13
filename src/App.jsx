import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./components/layout/AdminLayout";
import DocenteLayout from "./components/layout/DocenteLayout";
import UsuarioLayout from "./components/layout/UsuarioLayout";
import DashboardAdminPage from "./pages/admin/DashboardAdmin";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import GestionCursos from "./pages/admin/GestionCursos";
import Reportes from "./pages/admin/Reportes";
import Configuracion from "./pages/admin/Configuracion";
import Matriculas from "./pages/admin/Matriculas";
import DashboardDocente from "./pages/docente/DashboardDocente";
import MisCursos from "./pages/docente/MisCursos";
import ListaEstudiantes from "./pages/docente/ListaEstudiantes";
import Calificaciones from "./pages/docente/Calificaciones";
import MaterialDidactico from "./pages/docente/MaterialDidactico";
import AsistenciaDocente from "./pages/docente/AsistenciaDocente";
import DashboardEstudiante from "./pages/usuario/DashboardEstudiante";
import MisCursosEstudiante from "./pages/usuario/MisCursos";
import CalificacionesEstudiante from "./pages/usuario/Calificaciones";
import HorarioEstudiante from "./pages/usuario/Horario";
import AsistenciaEstudiante from "./pages/usuario/AsistenciaEstudiante";
import MaterialesEstudiante from "./pages/usuario/MaterialesEstudiante";
import CalendarioEstudiante from "./pages/usuario/CalendarioEstudiante";
import { ADMIN_ROUTES, DOCENTE_ROUTES, USUARIO_ROUTES } from "./constant/routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to={ADMIN_ROUTES.DASHBOARD} replace />} />
            <Route path="dashboard" element={<DashboardAdminPage />} />
            <Route path="usuarios" element={<GestionUsuarios />} />
            <Route path="cursos" element={<GestionCursos />} />
            <Route path="matriculas" element={<Matriculas />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>

          {/* Docente */}
          <Route path="/docente" element={
            <ProtectedRoute allowedRoles={["docente"]}>
              <DocenteLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to={DOCENTE_ROUTES.DASHBOARD} replace />} />
            <Route path="dashboard" element={<DashboardDocente />} />
            <Route path="cursos" element={<MisCursos />} />
            <Route path="estudiantes" element={<ListaEstudiantes />} />
            <Route path="asistencia" element={<AsistenciaDocente />} />
            <Route path="calificaciones" element={<Calificaciones />} />
            <Route path="material" element={<MaterialDidactico />} />
          </Route>

          {/* Estudiante */}
          <Route path="/usuario" element={
            <ProtectedRoute allowedRoles={["estudiante"]}>
              <UsuarioLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/usuario/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardEstudiante />} />
            <Route path="cursos" element={<MisCursosEstudiante />} />
            <Route path="calificaciones" element={<CalificacionesEstudiante />} />
            <Route path="asistencia" element={<AsistenciaEstudiante />} />
            <Route path="materiales" element={<MaterialesEstudiante />} />
            <Route path="horario" element={<HorarioEstudiante />} />
            <Route path="calendario" element={<CalendarioEstudiante />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;