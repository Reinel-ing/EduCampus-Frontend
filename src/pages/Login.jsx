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
        <div className={styles.loginHeader}>
          <div className={styles.logoContainer}>
            <img
  src="/logo_educampus.png"
  alt="EduCampus Logo"
  className={styles.logoImage}
/>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>EduCampus</h1>
            <p className={styles.subtitle}>Iniciar sesión</p>
          </div>
        </div>

        <div className={styles.infoBanner}>
          <p>
            Bienvenido a la plataforma <strong>EduCampus</strong>. Ingresa según
            tu rol: Administrador, Docente o Estudiante.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>
              Correo
            </label>
            <input
              type="email"
              id="correo"
              className={styles.input}
              placeholder="correo@edu.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contraseña" className={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              className={styles.input}
              placeholder="••••••••"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              disabled={cargando}
            />
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
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;