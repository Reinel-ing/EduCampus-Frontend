import React from "react";
import { render, screen } from "@testing-library/react";
import EstadoBadge from "../components/estudiante/EstadoBadge";

describe("EstadoBadge — pruebas de componente", () => {
  test("CP-EB01 | muestra 'Aprobado' con tipo aprobado", () => {
    render(<EstadoBadge tipo="aprobado" />);
    expect(screen.getByText("Aprobado")).toBeInTheDocument();
  });

  test("CP-EB02 | muestra 'Reprobado' con tipo reprobado", () => {
    render(<EstadoBadge tipo="reprobado" />);
    expect(screen.getByText("Reprobado")).toBeInTheDocument();
  });

  test("CP-EB03 | muestra 'En Progreso' con tipo en_progreso", () => {
    render(<EstadoBadge tipo="en_progreso" />);
    expect(screen.getByText("En Progreso")).toBeInTheDocument();
  });

  test("CP-EB04 | muestra 'Presente' con tipo presente", () => {
    render(<EstadoBadge tipo="presente" />);
    expect(screen.getByText("Presente")).toBeInTheDocument();
  });

  test("CP-EB05 | muestra 'Ausente' con tipo ausente", () => {
    render(<EstadoBadge tipo="ausente" />);
    expect(screen.getByText("Ausente")).toBeInTheDocument();
  });

  test("CP-EB06 | muestra 'Pendiente' con tipo pendiente", () => {
    render(<EstadoBadge tipo="pendiente" />);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  test("CP-EB07 | muestra 'Activo' con tipo activo", () => {
    render(<EstadoBadge tipo="activo" />);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  test("CP-EB08 | nota >= 3.0 muestra Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={4.0} />);
    expect(screen.getByText(/Aprobado/i)).toBeInTheDocument();
  });

  test("CP-EB09 | nota < 3.0 muestra No aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={2.5} />);
    expect(screen.getByText(/No aprobado/i)).toBeInTheDocument();
  });

  test("CP-EB10 | nota exactamente 3.0 muestra Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={3.0} />);
    expect(screen.getByText(/Aprobado/i)).toBeInTheDocument();
  });

  test("CP-EB11 | tipo desconocido no renderiza nada", () => {
    const { container } = render(<EstadoBadge tipo="desconocido" />);
    expect(container.firstChild).toBeNull();
  });

  test("CP-EB12 | nota formatea el número con un decimal", () => {
    render(<EstadoBadge tipo="nota" nota={4} />);
    expect(screen.getByText(/4\.0/)).toBeInTheDocument();
  });
});
