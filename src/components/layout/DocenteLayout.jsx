import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Header from "../shared/Header";
import styles from "../../styles/AdminLayout.module.css";

const DocenteLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar userType="docente" />
      <div className={styles.mainContent} style={{ marginLeft: "256px" }}>
        <main className={styles.mainContainer}>
          <Header title="Panel de Docente" />
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocenteLayout;