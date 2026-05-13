import React, { createContext, useState, useContext, useEffect } from "react";
import {
  iniciarSesion as loginService,
  cerrarSesion as logoutService,
  obtenerUsuarioActual,
  estaAutenticado as checkAuth,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión al cargar
    const autenticado = checkAuth();
    if (autenticado) {
      const usuarioGuardado = obtenerUsuarioActual();
      setUsuario(usuarioGuardado);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const iniciarSesion = async (correo, contraseña) => {
    const resultado = await loginService(correo, contraseña);
    if (!resultado.error) {
      setUsuario(resultado.data);
      setIsAuthenticated(true);
      return { error: false };
    }
    return resultado;
  };

  const cerrarSesion = () => {
    logoutService();
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const value = {
    usuario,
    isAuthenticated,
    loading,
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
