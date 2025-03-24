import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App Component", () => {
  test("renders App component and shows the Header", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Check if Header is rendered
    expect(screen.getByText("Supply Chain Management")).toBeInTheDocument();
  });

  test("redirects to Dashboard by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Ensure that Dashboard is displayed after redirect
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });


});
