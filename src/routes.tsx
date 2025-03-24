import {Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashbaord/Dashboard";
import Suppliers from "./components/Suppliers/Suppliers";
import Orders from "./components/Orders/Orders"; 
import Customers from "./components/Customers/Customers";
import Products from "./components/Products/Products";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />

      </Routes>
  );
};

export default AppRoutes;
