import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    iniciarSesion: jest.fn(),
    isAuthenticated: false,
    loading: false,
  }),
}));

import Login from "../pages/Login";

const renderLogin = () =>
  render(<MemoryRouter><Login /></MemoryRouter>);

describe("SIS — Pruebas de Portabilidad", () => {
  test("SIS-P01 | el componente Login renderiza sin errores", () => {
    expect(() => renderLogin()).not.toThrow();
  });

  test("SIS-P02 | el formulario existe en el DOM", () => {
    renderLogin();
    expect(document.querySelector("form")).toBeInTheDocument();
  });

  test("SIS-P03 | los inputs son accesibles por rol", () => {
    renderLogin();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  test("SIS-P04 | los botones son accesibles por rol", () => {
    renderLogin();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test("SIS-P05 | la imagen del logo tiene atributo alt", () => {
    renderLogin();
    const img = screen.getByAltText(/educampus logo/i);
    expect(img).toBeInTheDocument();
  });

  test("SIS-P06 | el título principal está en el documento", () => {
    renderLogin();
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });

  test("SIS-P07 | el componente no genera advertencias de PropTypes", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderLogin();
    const propTypeErrors = consoleSpy.mock.calls.filter(call =>
      call[0] && call[0].includes && call[0].includes("propTypes")
    );
    expect(propTypeErrors.length).toBe(0);
    consoleSpy.mockRestore();
  });

  test("SIS-P08 | el formulario tiene atributo autocomplete desactivado", () => {
    renderLogin();
    const form = document.querySelector("form");
    expect(form).toHaveAttribute("autocomplete", "off");
  });
});
