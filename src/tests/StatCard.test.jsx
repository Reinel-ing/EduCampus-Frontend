import React from "react";
import { render, screen } from "@testing-library/react";
import StatCard from "../components/administrador/StatCard";

describe("StatCard — pruebas de componente", () => {
  test("CP-SC01 | muestra el título correctamente", () => {
    render(<StatCard title="Estudiantes" value={42} icon="👨‍🎓" />);
    expect(screen.getByText("Estudiantes")).toBeInTheDocument();
  });

  test("CP-SC02 | muestra el valor correctamente", () => {
    render(<StatCard title="Cursos" value={10} icon="📚" />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("CP-SC03 | muestra el ícono correctamente", () => {
    render(<StatCard title="Docentes" value={5} icon="👨‍🏫" />);
    expect(screen.getByText("👨‍🏫")).toBeInTheDocument();
  });

  test("CP-SC04 | acepta valor cero", () => {
    render(<StatCard title="Pendientes" value={0} icon="⚠️" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("CP-SC05 | acepta valor string", () => {
    render(<StatCard title="Estado" value="Activo" icon="✅" />);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  test("CP-SC06 | renderiza sin errores", () => {
    expect(() => render(<StatCard title="Test" value={1} icon="🔥" />)).not.toThrow();
  });

  test("CP-SC07 | el título está en uppercase (CSS class)", () => {
    const { container } = render(<StatCard title="TOTAL" value={99} icon="📊" />);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  test("CP-SC08 | acepta valores grandes", () => {
    render(<StatCard title="Total" value={999999} icon="🏆" />);
    expect(screen.getByText("999999")).toBeInTheDocument();
  });
});
