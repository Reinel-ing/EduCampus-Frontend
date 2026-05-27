import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Header from "../shared/Header";
import styles from "../../styles/AdminLayout.module.css";

const UsuarioLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar userType="estudiante" />
      <div className={styles.mainContent} style={{ marginLeft: "240px" }}>
        <main className={styles.mainContainer}>
          <Header title="Panel del Estudiante" />
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsuarioLayout;