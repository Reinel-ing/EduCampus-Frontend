import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title = "Panel de Administración" }) => {
  const { usuario } = useAuth();

  return (
    <header className="bg-indigo-600 text-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>

        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 rounded-full px-4 py-2 flex items-center">
            <span className="text-xl mr-2">👤</span>
            <span className="font-semibold">
              {usuario?.nombres || "Usuario"} {usuario?.apellidos || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
