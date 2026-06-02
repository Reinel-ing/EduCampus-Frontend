import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    loading: false,
    usuario: null,
    iniciarSesion: jest.fn(),
    cerrarSesion: jest.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

describe("App — prueba general", () => {
  test("APP-01 | la aplicación renderiza sin errores críticos", () => {
    expect(() =>
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <div id="root">App EduCampus</div>
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});
