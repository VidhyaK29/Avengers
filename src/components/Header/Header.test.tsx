import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Header from "./Header";

describe("Header Component", () => {
  test("renders the header with title", () => {
    render(
      <MemoryRouter>
        <Header setIsAuthenticated={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
      </MemoryRouter>
    );

    // Check if the title is rendered
    expect(screen.getByText("Supply Chain Management")).toBeInTheDocument();
  });

  test("renders icons and user avatar", () => {
    render(
      <MemoryRouter>
        <Header setIsAuthenticated={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
      </MemoryRouter>
    );

    // Check if the icons are rendered
    expect(screen.getByTitle("Avengers")).toBeInTheDocument();
    expect(screen.getByAltText("User Profile")).toBeInTheDocument();
  });

  test("shows user popup when avatar is clicked", () => {
    render(
      <MemoryRouter>
        <Header setIsAuthenticated={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
      </MemoryRouter>
    );

    // Click on user avatar
    fireEvent.click(screen.getByAltText("User Profile"));

    // Check if popup appears
    expect(screen.getByText("Avengers")).toBeInTheDocument();
    expect(screen.getByText("avengers@gmail.com")).toBeInTheDocument();
  });

  test("hides user popup when clicking outside", () => {
    render(
      <MemoryRouter>
        <Header setIsAuthenticated={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
      </MemoryRouter>
    );

    // Click on user avatar to open the popup
    fireEvent.click(screen.getByAltText("User Profile"));
    expect(screen.getByText("Avengers")).toBeInTheDocument();

    // Click outside the popup
    fireEvent.mouseDown(document.body);

    // Popup should disappear
    expect(screen.queryByText("Avengers")).not.toBeInTheDocument();
  });
});
