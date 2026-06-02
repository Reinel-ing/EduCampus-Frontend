import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import FormModal from "../components/ui/FormModal";
import HorarioSelector from "../components/ui/HorarioSelector";

// ─── FormModal ───────────────────────────────────────────────────────────────
// Referencia estable para evitar loop infinito en useEffect([isOpen, initialData, fields])
const CAMPOS_BASICOS = Object.freeze([
  Object.freeze({ name: "nombres", label: "Nombres", type: "text", placeholder: "Ingrese nombres" }),
  Object.freeze({ name: "correo",  label: "Correo",  type: "text", placeholder: "correo@ejemplo.com" }),
]);
const EMPTY_DATA = Object.freeze({});
const EMPTY_FIELDS = Object.freeze([]);

describe("FormModal — pruebas de componente", () => {
  test("CP-FM01 | no renderiza nada cuando isOpen es false", () => {
    const { container } = render(
      <FormModal isOpen={false} onClose={jest.fn()} onSubmit={jest.fn()} title="Test" fields={CAMPOS_BASICOS} initialData={EMPTY_DATA} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("CP-FM02 | renderiza el título cuando isOpen es true", () => {
    render(
      <FormModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} title="Crear Estudiante" icon="👤" fields={CAMPOS_BASICOS} initialData={EMPTY_DATA} />
    );
    expect(screen.getByText("Crear Estudiante")).toBeInTheDocument();
  });

  test("CP-FM03 | renderiza los campos del formulario", () => {
    render(
      <FormModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} title="Test" fields={CAMPOS_BASICOS} initialData={EMPTY_DATA} />
    );
    expect(screen.getByPlaceholderText("Ingrese nombres")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("correo@ejemplo.com")).toBeInTheDocument();
  });

  test("CP-FM04 | llama onClose cuando se hace click en Cancelar", () => {
    const onClose = jest.fn();
    render(
      <FormModal isOpen={true} onClose={onClose} onSubmit={jest.fn()} title="Test" fields={CAMPOS_BASICOS} initialData={EMPTY_DATA} />
    );
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(onClose).toHaveBeenCalled();
  });

  test("CP-FM05 | muestra el ícono cuando se proporciona", () => {
    render(
      <FormModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} title="Test" icon="🎓" fields={CAMPOS_BASICOS} initialData={EMPTY_DATA} />
    );
    expect(screen.getByText("🎓")).toBeInTheDocument();
  });

  test("CP-FM06 | muestra errores de validación", () => {
    render(
      <FormModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} title="Test"
        fields={CAMPOS_BASICOS} initialData={EMPTY_DATA}
        validationErrors={{ nombres: "El nombre es requerido" }} />
    );
    // El componente muestra el error con prefijo ⚠️
    expect(screen.getByText(/El nombre es requerido/i)).toBeInTheDocument();
  });

  test("CP-FM07 | renderiza sin errores con campos mínimos", () => {
    expect(() =>
      render(<FormModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} title="T" fields={EMPTY_FIELDS} initialData={EMPTY_DATA} />)
    ).not.toThrow();
  });
});

// ─── HorarioSelector ─────────────────────────────────────────────────────────
describe("HorarioSelector — pruebas de componente", () => {
  test("CP-HS01 | renderiza sin errores", () => {
    expect(() => render(<HorarioSelector value={[]} onChange={jest.fn()} />)).not.toThrow();
  });

  test("CP-HS02 | muestra el botón para agregar horario", () => {
    render(<HorarioSelector value={[]} onChange={jest.fn()} />);
    // El botón tiene role "button" con texto "+ Agregar Horario"
    expect(screen.getByRole("button", { name: /Agregar Horario/i })).toBeInTheDocument();
  });

  test("CP-HS03 | al agregar horario aparece selector de día", () => {
    render(<HorarioSelector value={[]} onChange={jest.fn()} />);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Agregar Horario/i }));
    });
    expect(screen.getByText("Lunes")).toBeInTheDocument();
  });

  test("CP-HS04 | muestra mensaje de error cuando se proporciona", () => {
    render(<HorarioSelector value={[]} onChange={jest.fn()} error="Debe agregar al menos un horario" />);
    expect(screen.getByText(/Debe agregar al menos un horario/i)).toBeInTheDocument();
  });

  test("CP-HS05 | no muestra error cuando no se proporciona", () => {
    render(<HorarioSelector value={[]} onChange={jest.fn()} />);
    expect(screen.queryByText(/Debe agregar/i)).not.toBeInTheDocument();
  });
});
