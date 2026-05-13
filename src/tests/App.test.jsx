import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // matchers extendidos
import App from "../App";

test("renderiza la página de login por defecto", () => {
  render(<App />); // No MemoryRouter porque App ya tiene BrowserRouter

  // Ajusta el texto según tu Login.jsx
  const loginHeading = screen.getByText(/iniciar sesión/i); 
  expect(loginHeading).toBeInTheDocument(); // Ahora funciona
});