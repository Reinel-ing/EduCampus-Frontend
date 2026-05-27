import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EstadoBadge from "../components/estudiante/EstadoBadge";

// =============================================================================
// CLASES DE EQUIVALENCIA — tipo de estado conocido
// =============================================================================
describe("CE — tipo de estado conocido", () => {
  test("CE-01 | tipo='aprobado' → muestra texto Aprobado", () => {
    render(<EstadoBadge tipo="aprobado" />);
    expect(screen.getByText("Aprobado")).toBeInTheDocument();
  });

  test("CE-02 | tipo='reprobado' → muestra texto Reprobado", () => {
    render(<EstadoBadge tipo="reprobado" />);
    expect(screen.getByText("Reprobado")).toBeInTheDocument();
  });

  test("CE-03 | tipo='presente' → muestra texto Presente", () => {
    render(<EstadoBadge tipo="presente" />);
    expect(screen.getByText("Presente")).toBeInTheDocument();
  });

  test("CE-04 | tipo='ausente' → muestra texto Ausente", () => {
    render(<EstadoBadge tipo="ausente" />);
    expect(screen.getByText("Ausente")).toBeInTheDocument();
  });

  test("CE-05 | tipo='pendiente' → muestra texto Pendiente", () => {
    render(<EstadoBadge tipo="pendiente" />);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  test("CE-06 | tipo='entregado' → muestra texto Entregado", () => {
    render(<EstadoBadge tipo="entregado" />);
    expect(screen.getByText("Entregado")).toBeInTheDocument();
  });

  test("CE-07 | tipo desconocido → no renderiza nada", () => {
    const { container } = render(<EstadoBadge tipo="invalido" />);
    expect(container.firstChild).toBeNull();
  });
});

// =============================================================================
// CLASES DE EQUIVALENCIA — tipo="nota"
// =============================================================================
describe("CE — tipo nota (escala 0-5)", () => {
  test("CE-08 | nota=4.5 → muestra Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={4.5} />);
    expect(screen.getByText(/Aprobado/)).toBeInTheDocument();
  });

  test("CE-09 | nota=1.5 → muestra No aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={1.5} />);
    expect(screen.getByText(/No aprobado/)).toBeInTheDocument();
  });
});

// =============================================================================
// VALORES LIMITE — nota (limite: 3.0 para aprobar)
// =============================================================================
describe("VL — nota (limite 3.0)", () => {
  test("VL-01 | nota=2.9 → No aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={2.9} />);
    expect(screen.getByText(/No aprobado/)).toBeInTheDocument();
  });

  test("VL-02 | nota=3.0 exactamente → Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={3.0} />);
    expect(screen.getByText(/Aprobado/)).toBeInTheDocument();
  });

  test("VL-03 | nota=3.1 → Aprobado", () => {
    render(<EstadoBadge tipo="nota" nota={3.1} />);
    expect(screen.getByText(/Aprobado/)).toBeInTheDocument();
  });
});
