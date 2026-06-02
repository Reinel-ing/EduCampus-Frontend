import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mocks de servicios
jest.mock("../services/estudianteService", () => ({
  listarEstudiantes: jest.fn(),
  eliminarEstudiante: jest.fn(),
}));
jest.mock("../services/docenteService", () => ({
  listarDocentes: jest.fn(),
  eliminarDocente: jest.fn(),
}));

import * as estudianteService from "../services/estudianteService";
import * as docenteService from "../services/docenteService";
import DashboardStats from "../components/administrador/DashboardStats";
import CursoCard from "../components/administrador/CursoCard";
import TablaEstudiantes from "../components/administrador/TablaEstudiantes";
import TablaDocentes from "../components/administrador/TablaDocentes";

const mockStats = { total_estudiantes: 50, total_docentes: 10, total_cursos: 8, cursos_activos: 6 };
const mockCurso = { id_curso: 1, nombre: "Calculo", cupo_estudiante: 30, id_docente: 1, estado: true, horario: [{ dia: "Lunes", hora: "08:00" }] };
const mockDocentes = [{ id_docente: 1, nombres: "Maria", apellidos: "Lopez" }];

describe("DashboardStats — pruebas de componente", () => {
  test("CP-DAST01 | renderiza sin errores", () => {
    expect(() => render(<DashboardStats stats={mockStats} />)).not.toThrow();
  });

  test("CP-DAST02 | muestra el título de bienvenida", () => {
    render(<DashboardStats stats={mockStats} />);
    expect(screen.getByText(/panel de administración/i)).toBeInTheDocument();
  });

  test("CP-DAST03 | muestra el total de usuarios correctamente", () => {
    render(<DashboardStats stats={mockStats} />);
    expect(screen.getByText("60")).toBeInTheDocument(); // 50 + 10
  });

  test("CP-DAST04 | muestra los cursos activos", () => {
    render(<DashboardStats stats={mockStats} />);
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  test("CP-DAST05 | muestra el número de docentes", () => {
    render(<DashboardStats stats={mockStats} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});

describe("CursoCard — pruebas de componente", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnDetails = jest.fn();

  test("CP-CC01 | renderiza el nombre del curso", () => {
    render(
      <MemoryRouter>
        <CursoCard curso={mockCurso} docentes={mockDocentes} onEdit={mockOnEdit} onDelete={mockOnDelete} onDetails={mockOnDetails} />
      </MemoryRouter>
    );
    expect(screen.getByText("Calculo")).toBeInTheDocument();
  });

  test("CP-CC02 | muestra el nombre del docente asignado", () => {
    render(
      <MemoryRouter>
        <CursoCard curso={mockCurso} docentes={mockDocentes} onEdit={mockOnEdit} onDelete={mockOnDelete} onDetails={mockOnDetails} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Maria Lopez/i)).toBeInTheDocument();
  });

  test("CP-CC03 | muestra Sin asignar cuando no hay docente", () => {
    render(
      <MemoryRouter>
        <CursoCard curso={{ ...mockCurso, id_docente: 99 }} docentes={mockDocentes} onEdit={mockOnEdit} onDelete={mockOnDelete} onDetails={mockOnDetails} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sin asignar/i)).toBeInTheDocument();
  });

  test("CP-CC04 | muestra el horario del curso", () => {
    render(
      <MemoryRouter>
        <CursoCard curso={mockCurso} docentes={mockDocentes} onEdit={mockOnEdit} onDelete={mockOnDelete} onDetails={mockOnDetails} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Lunes/i)).toBeInTheDocument();
  });
});

describe("TablaEstudiantes — pruebas de componente", () => {
  beforeEach(() => {
    estudianteService.listarEstudiantes.mockResolvedValue([
      { id_estudiante: 1, nombres: "Juan", apellidos: "Garcia", cedula: "123", correo: "j@gmail.com", telefono: "3001", estado: true },
    ]);
  });

  test("CP-TE01 | renderiza sin errores", async () => {
    expect(() => render(<MemoryRouter><TablaEstudiantes onEdit={jest.fn()} /></MemoryRouter>)).not.toThrow();
  });

  test("CP-TE02 | muestra estudiantes después de cargar", async () => {
    render(<MemoryRouter><TablaEstudiantes onEdit={jest.fn()} /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Juan/i)).toBeInTheDocument());
  });
});

describe("TablaDocentes — pruebas de componente", () => {
  beforeEach(() => {
    docenteService.listarDocentes.mockResolvedValue([
      { id_docente: 1, nombres: "Maria", apellidos: "Lopez", cedula: "999", correo: "m@gmail.com", especialidad: "Mat", telefono: "3009", estado: true },
    ]);
  });

  test("CP-TD01 | renderiza sin errores", async () => {
    expect(() => render(<MemoryRouter><TablaDocentes onEdit={jest.fn()} /></MemoryRouter>)).not.toThrow();
  });

  test("CP-TD02 | muestra docentes después de cargar", async () => {
    render(<MemoryRouter><TablaDocentes onEdit={jest.fn()} /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Maria/i)).toBeInTheDocument());
  });
});
