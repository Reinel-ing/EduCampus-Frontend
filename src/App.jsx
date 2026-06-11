import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingFallback from "./components/LoadingFallback";
import { ADMIN_ROUTES, DOCENTE_ROUTES, USUARIO_ROUTES } from "./constant/routes";

// ⚡ Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const DocenteLayout = lazy(() => import("./components/layout/DocenteLayout"));
const UsuarioLayout = lazy(() => import("./components/layout/UsuarioLayout"));

// Admin pages
const DashboardAdminPage = lazy(() => import("./pages/admin/DashboardAdmin"));
const GestionUsuarios = lazy(() => import("./pages/admin/GestionUsuarios"));
const GestionCursos = lazy(() => import("./pages/admin/GestionCursos"));
const Reportes = lazy(() => import("./pages/admin/Reportes"));
const Configuracion = lazy(() => import("./pages/admin/Configuracion"));
const Matriculas = lazy(() => import("./pages/admin/Matriculas"));
const NotificacionesAdmin = lazy(() => import("./pages/admin/NotificacionesAdmin"));
const CalendarioAdmin = lazy(() => import("./pages/admin/CalendarioAdmin"));
const RendimientoAdmin = lazy(() => import("./pages/admin/RendimientoAdmin"));
const AlertasAdmin = lazy(() => import("./pages/admin/AlertasAdmin"));

// Docente pages
const DashboardDocente = lazy(() => import("./pages/docente/DashboardDocente"));
const MisCursos = lazy(() => import("./pages/docente/MisCursos"));
const ListaEstudiantes = lazy(() => import("./pages/docente/ListaEstudiantes"));
const Calificaciones = lazy(() => import("./pages/docente/Calificaciones"));
const MaterialDidactico = lazy(() => import("./pages/docente/MaterialDidactico"));
const AsistenciaDocente = lazy(() => import("./pages/docente/AsistenciaDocente"));
const CalendarioDocente = lazy(() => import("./pages/docente/CalendarioDocente"));
const NotificacionesDocente = lazy(() => import("./pages/docente/NotificacionesDocente"));
const ActividadesDocente = lazy(() => import("./pages/docente/ActividadesDocente"));

// Estudiante pages
const DashboardEstudiante = lazy(() => import("./pages/usuario/DashboardEstudiante"));
const MisCursosEstudiante = lazy(() => import("./pages/usuario/MisCursos"));
const CalificacionesEstudiante = lazy(() => import("./pages/usuario/Calificaciones"));
const HorarioEstudiante = lazy(() => import("./pages/usuario/Horario"));
const AsistenciaEstudiante = lazy(() => import("./pages/usuario/AsistenciaEstudiante"));
const MaterialesEstudiante = lazy(() => import("./pages/usuario/MaterialesEstudiante"));
const CalendarioEstudiante = lazy(() => import("./pages/usuario/CalendarioEstudiante"));
const NotificacionesEstudiante = lazy(() => import("./pages/usuario/NotificacionesEstudiante"));
const ActividadesEstudiante = lazy(() => import("./pages/usuario/ActividadesEstudiante"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
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
              <Route path="notificaciones" element={<NotificacionesAdmin />} />
              <Route path="calendario" element={<CalendarioAdmin />} />
              <Route path="rendimiento" element={<RendimientoAdmin />} />
              <Route path="alertas" element={<AlertasAdmin />} />
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
              <Route path="calendario" element={<CalendarioDocente />} />
              <Route path="notificaciones" element={<NotificacionesDocente />} />
              <Route path="actividades" element={<ActividadesDocente />} />
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
              <Route path="notificaciones" element={<NotificacionesEstudiante />} />
              <Route path="actividades" element={<ActividadesEstudiante />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;