import React from "react";
import { render, screen } from "@testing-library/react";
import CursoCardDocente from "../components/docente/CursoCardDocente";

jest.mock("../services/asistenciaService", () => ({
  registrarAsistencia: jest.fn(),
  obtenerPorcentajeAsistencia: jest.fn().mockResolvedValue(85),
}));

const mockCurso = {
  id_curso: 1,
  nombre: "Programacion Web",
  cupo_estudiante: 25,
  id_docente: 1,
  estado: true,
  horario: [{ dia: "Martes", hora: "10:00" }],
};

describe("CursoCardDocente — pruebas de componente", () => {
  test("CP-CCD01 | renderiza el nombre del curso", () => {
    render(<CursoCardDocente curso={mockCurso} onVerDetalles={jest.fn()} />);
    expect(screen.getByText("Programacion Web")).toBeInTheDocument();
  });

  test("CP-CCD02 | muestra estado Activo cuando estado es true", () => {
    render(<CursoCardDocente curso={mockCurso} onVerDetalles={jest.fn()} />);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  test("CP-CCD03 | muestra estado Inactivo cuando estado es false", () => {
    render(<CursoCardDocente curso={{ ...mockCurso, estado: false }} onVerDetalles={jest.fn()} />);
    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });

  test("CP-CCD04 | muestra el horario del curso", () => {
    render(<CursoCardDocente curso={mockCurso} onVerDetalles={jest.fn()} />);
    expect(screen.getByText(/Martes/i)).toBeInTheDocument();
  });

  test("CP-CCD05 | renderiza sin errores", () => {
    expect(() => render(<CursoCardDocente curso={mockCurso} onVerDetalles={jest.fn()} />)).not.toThrow();
  });

  test("CP-CCD06 | muestra el cupo del curso", () => {
    render(<CursoCardDocente curso={mockCurso} onVerDetalles={jest.fn()} />);
    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
