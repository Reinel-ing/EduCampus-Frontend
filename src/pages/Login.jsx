import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !contraseña) {
      setError("Por favor completa todos los campos");
      return;
    }

    const correoLower = correo.toLowerCase();
    if (!correoLower.endsWith("@gmail.com") && !correoLower.endsWith("@outlook.com")) {
      setError("Solo se permiten correos @gmail.com o @outlook.com");
      return;
    }

    setCargando(true);
    const resultado = await iniciarSesion(correo, contraseña);
    setCargando(false);

    if (resultado.error) {
      setError(resultado.message);
    } else {
      const usuarioData = JSON.parse(localStorage.getItem("usuario"));
      const rol = usuarioData?.rol;

      if (rol === "docente") {
        navigate("/docente/dashboard");
      } else if (rol === "estudiante") {
        navigate("/usuario/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    }
  };

  const handleReestablecer = () => {
    setCorreo("");
    setContraseña("");
    setError("");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        {/* Cabecera azul */}
        <div className={styles.cardTop}>
          <div className={styles.topContent}>
            <h1 className={styles.title}>EduCampus</h1>
            <p className={styles.subtitle}>Sistema de Gestión Educativa</p>
          </div>
        </div>

        {/* Logo flotante sobre la unión */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoContainer}>
            <img
              src="/logo_educampus.png"
              alt="EduCampus Logo"
              className={styles.logoImage}
            />
          </div>
        </div>

        {/* Barra de roles */}
        <div className={styles.rolesBar}>
          <span className={styles.rolesLabel}>Acceso para:</span>
          <span className={styles.roleChip}>👑 Administrador</span>
          <span className={styles.roleChip}>📚 Docente</span>
          <span className={styles.roleChip}>🎒 Estudiante</span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.loginForm} autoComplete="off">
          <h3 className={styles.formTitle}>Iniciar sesión</h3>

          {error && (
            <div className={styles.errorMessage}>
              <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>
              Correo electrónico
            </label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                id="correo"
                className={styles.input}
                placeholder="correo@gmail.com o @outlook.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={cargando}
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contraseña" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="password"
                id="contraseña"
                className={styles.input}
                placeholder="••••••••"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                disabled={cargando}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={handleReestablecer}
              disabled={cargando}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={cargando}
            >
              {cargando ? "Ingresando..." : "Ingresar →"}
            </button>
          </div>
        </form>

        <div className={styles.cardFooter}>
          <p>¿Problemas para acceder? Contacta al administrador · © 2025 EduCampus</p>
        </div>

      </div>
    </div>
  );
};

export default Login;
