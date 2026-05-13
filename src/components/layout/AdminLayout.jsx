import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Header from "../shared/Header";
import styles from "../../styles/AdminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent} style={{ marginLeft: "256px" }}>
        <main className={styles.mainContainer}>
          <Header title="Panel de Administración" />
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;