// Utilidades para generar PDFs en el cliente
import jsPDF from "jspdf";
import "jspdf-autotable";

// Generar PDF de Asistencia General
export const generarPDFAsistenciaGeneral = (datos) => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, "bold");
  doc.text("Reporte de Asistencia General", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha de generación: ${fechaActual}`, 105, 30, {
    align: "center",
  });

  // Estadísticas generales
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("📊 Estadísticas Generales", 14, 55);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  let yPos = 65;

  const stats = [
    {
      label: "Promedio de asistencia:",
      value: `${datos.promedio_asistencia || 85}%`,
    },
    {
      label: "Total de estudiantes:",
      value: datos.total_estudiantes || 0,
    },
    { label: "Total de cursos:", value: datos.total_cursos || 0 },
    {
      label: "Asistencias registradas:",
      value: datos.total_registros || 0,
    },
  ];

  stats.forEach((stat) => {
    doc.setFont(undefined, "bold");
    doc.text(stat.label, 14, yPos);
    doc.setFont(undefined, "normal");
    doc.text(String(stat.value), 100, yPos);
    yPos += 8;
  });

  // Tabla de asistencia por curso
  if (datos.asistencia_por_curso && datos.asistencia_por_curso.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("📚 Asistencia por Curso", 14, yPos);

    const tableData = datos.asistencia_por_curso.map((curso) => [
      curso.nombre_curso,
      curso.total_estudiantes,
      curso.asistencias_totales,
      `${curso.porcentaje_asistencia}%`,
    ]);

    doc.autoTable({
      startY: yPos + 5,
      head: [["Curso", "Estudiantes", "Asistencias", "Promedio"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount} - EduCampus`,
      105,
      290,
      { align: "center" }
    );
  }

  return doc;
};

// Generar PDF de Rendimiento Académico
export const generarPDFRendimientoAcademico = (datos) => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Header
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, "bold");
  doc.text("Reporte de Rendimiento Académico", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha de generación: ${fechaActual}`, 105, 30, {
    align: "center",
  });

  // Estadísticas
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("📈 Indicadores de Rendimiento", 14, 55);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  let yPos = 65;

  const stats = [
    {
      label: "Promedio general:",
      value: `${datos.promedio_general || 78}/100`,
    },
    {
      label: "Estudiantes con buen rendimiento:",
      value: datos.estudiantes_alto_rendimiento || 0,
    },
    {
      label: "Estudiantes que requieren apoyo:",
      value: datos.estudiantes_bajo_rendimiento || 0,
    },
    { label: "Tasa de aprobación:", value: `${datos.tasa_aprobacion || 85}%` },
  ];

  stats.forEach((stat) => {
    doc.setFont(undefined, "bold");
    doc.text(stat.label, 14, yPos);
    doc.setFont(undefined, "normal");
    doc.text(String(stat.value), 100, yPos);
    yPos += 8;
  });

  // Tabla de rendimiento por curso
  if (datos.rendimiento_por_curso && datos.rendimiento_por_curso.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("📚 Rendimiento por Curso", 14, yPos);

    const tableData = datos.rendimiento_por_curso.map((curso) => [
      curso.nombre_curso,
      `${curso.promedio_notas}/100`,
      `${curso.asistencia_promedio}%`,
      curso.estado_general,
    ]);

    doc.autoTable({
      startY: yPos + 5,
      head: [["Curso", "Promedio", "Asistencia", "Estado"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [245, 158, 11],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [255, 251, 235],
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount} - EduCampus`,
      105,
      290,
      { align: "center" }
    );
  }

  return doc;
};

// Generar PDF de Usuarios Activos
export const generarPDFUsuariosActivos = (datos) => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, "bold");
  doc.text("Reporte de Usuarios Activos", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha de generación: ${fechaActual}`, 105, 30, {
    align: "center",
  });

  // Estadísticas
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("👥 Resumen de Usuarios", 14, 55);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  let yPos = 65;

  const stats = [
    {
      label: "Usuarios activos este mes:",
      value: datos.usuarios_activos_mes || 8,
    },
    { label: "Total de estudiantes:", value: datos.total_estudiantes || 0 },
    { label: "Total de docentes:", value: datos.total_docentes || 0 },
    { label: "Nuevos registros:", value: datos.nuevos_registros || 0 },
  ];

  stats.forEach((stat) => {
    doc.setFont(undefined, "bold");
    doc.text(stat.label, 14, yPos);
    doc.setFont(undefined, "normal");
    doc.text(String(stat.value), 100, yPos);
    yPos += 8;
  });

  // Tabla de usuarios activos
  if (datos.lista_usuarios && datos.lista_usuarios.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("👤 Lista de Usuarios Activos", 14, yPos);

    const tableData = datos.lista_usuarios.map((usuario) => [
      `${usuario.nombres} ${usuario.apellidos}`,
      usuario.rol,
      usuario.correo,
      usuario.ultimo_acceso,
    ]);

    doc.autoTable({
      startY: yPos + 5,
      head: [["Nombre", "Rol", "Correo", "Último Acceso"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [236, 253, 245],
      },
      margin: { left: 14, right: 14 },
      styles: {
        fontSize: 9,
      },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount} - EduCampus`,
      105,
      290,
      { align: "center" }
    );
  }

  return doc;
};
