import React from "react";
import { render, screen } from "@testing-library/react";
import BannerPage from "../components/estudiante/BannerPage";
import CursoCardEstudiante from "../components/estudiante/CursoCardEstudiante";
import NotaResumen from "../components/estudiante/NotaResumen";

const mockCurso = {
  id_curso: 1,
  nombre: "Calculo Integral",
  horario: [{ dia: "Lunes", hora: "08:00" }],
  docente: { nombres: "Maria", apellidos: "Lopez", especialidad: "Matematicas", correo: "m@gmail.com" },
};

describe("BannerPage — pruebas de componente", () => {
  test("CP-BP01 | renderiza el título correctamente", () => {
    render(<BannerPage titulo="Mi Dashboard" subtitulo="Bienvenido" icono="🎓" />);
    expect(screen.getByText("Mi Dashboard")).toBeInTheDocument();
  });

  test("CP-BP02 | renderiza el subtítulo", () => {
    render(<BannerPage titulo="Dashboard" subtitulo="Estudiante" icono="📚" />);
    expect(screen.getByText("Estudiante")).toBeInTheDocument();
  });

  test("CP-BP03 | renderiza el ícono", () => {
    render(<BannerPage titulo="T" subtitulo="S" icono="🎯" />);
    expect(screen.getByText("🎯")).toBeInTheDocument();
  });

  test("CP-BP04 | renderiza sin errores con props mínimas", () => {
    expect(() => render(<BannerPage titulo="Test" subtitulo="Sub" icono="✅" />)).not.toThrow();
  });
});

describe("CursoCardEstudiante — pruebas de componente", () => {
  test("CP-CCE01 | renderiza el nombre del curso", () => {
    render(<CursoCardEstudiante curso={mockCurso} />);
    expect(screen.getByText("Calculo Integral")).toBeInTheDocument();
  });

  test("CP-CCE02 | muestra el nombre del docente", () => {
    render(<CursoCardEstudiante curso={mockCurso} />);
    expect(screen.getByText(/Maria/i)).toBeInTheDocument();
  });

  test("CP-CCE03 | muestra el horario del curso", () => {
    render(<CursoCardEstudiante curso={mockCurso} />);
    expect(screen.getByText(/Lunes/i)).toBeInTheDocument();
  });

  test("CP-CCE04 | renderiza sin errores con props básicas", () => {
    expect(() => render(<CursoCardEstudiante curso={mockCurso} />)).not.toThrow();
  });
});

describe("NotaResumen — pruebas de componente", () => {
  test("CP-NR01 | renderiza el nombre del curso", () => {
    render(<NotaResumen nombreCurso="Calculo Integral" parcial1={4.0} parcial2={3.5} final={4.5} />);
    expect(screen.getByText("Calculo Integral")).toBeInTheDocument();
  });

  test("CP-NR02 | muestra la nota del parcial 1 formateada", () => {
    render(<NotaResumen nombreCurso="Curso" parcial1={4.0} parcial2={3.5} final={4.5} />);
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  test("CP-NR03 | muestra la nota del parcial 2 formateada", () => {
    render(<NotaResumen nombreCurso="Curso" parcial1={4.0} parcial2={3.5} final={4.5} />);
    expect(screen.getByText("3.5")).toBeInTheDocument();
  });

  test("CP-NR04 | muestra la nota final formateada", () => {
    render(<NotaResumen nombreCurso="Curso" parcial1={4.0} parcial2={3.5} final={4.5} />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  test("CP-NR05 | renderiza sin errores", () => {
    expect(() => render(<NotaResumen nombreCurso="Test" parcial1={3.0} parcial2={3.0} final={3.0} />)).not.toThrow();
  });

  test("CP-NR06 | muestra guión cuando nota es null", () => {
    render(<NotaResumen nombreCurso="Curso" parcial1={null} parcial2={null} final={null} />);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});
