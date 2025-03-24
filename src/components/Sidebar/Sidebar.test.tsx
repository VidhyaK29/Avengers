/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar Component", () => {
  test("renders Sidebar with navigation links", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(getByText(/Dashboard/i)).toBeInTheDocument();
    expect(getByText(/Mails/i)).toBeInTheDocument();
  });

  test("should have active class when link is active", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(getByText(/Dashboard/i).closest("a")).toHaveClass("active");
  });
});
