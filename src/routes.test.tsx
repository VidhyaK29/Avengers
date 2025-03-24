import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashbaord/Dashboard";
import Suppliers from "./components/Suppliers/Suppliers";
import Orders from "./components/Orders/Orders";
import Customers from "./components/Customers/Customers";
import Products from "./components/Products/Products";
import AppRoutes from "./routes";

jest.mock("./components/Dashbaord/Dashboard", () => () => <div data-testid="dashboard">Dashboard</div>);
jest.mock("./components/Suppliers/Suppliers", () => () => <div data-testid="suppliers">Suppliers</div>);
jest.mock("./components/Orders/Orders", () => () => <div data-testid="orders">Orders</div>);
jest.mock("./components/Customers/Customers", () => () => <div data-testid="customers">Customers</div>);
jest.mock("./components/Products/Products", () => () => <div data-testid="products">Products</div>);

describe("AppRoutes", () => {
  const renderWithRouter = (initialRoute: string) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<AppRoutes />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders Dashboard component when navigating to /dashboard", () => {
    renderWithRouter("/dashboard");
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("renders Suppliers component when navigating to /suppliers", () => {
    renderWithRouter("/suppliers");
    expect(screen.getByTestId("suppliers")).toBeInTheDocument();
  });

  it("renders Orders component when navigating to /orders", () => {
    renderWithRouter("/orders");
    expect(screen.getByTestId("orders")).toBeInTheDocument();
  });

  it("renders Customers component when navigating to /customers", () => {
    renderWithRouter("/customers");
    expect(screen.getByTestId("customers")).toBeInTheDocument();
  });

  it("renders Products component when navigating to /products", () => {
    renderWithRouter("/products");
    expect(screen.getByTestId("products")).toBeInTheDocument();
  });
});
