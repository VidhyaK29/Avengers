import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import Products from "../Products/Products";
import Suppliers from "../Suppliers/Suppliers";
import Orders from "../Orders/Orders";
import Customers from "../Customers/Customers";
import { Counts } from "../../interfaces/common.interface";
import { appDataService } from "../../services/app.data.service";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("products"); // Default to "products"
  const [counts, setCounts] = useState<{ products: number; suppliers: number; orders: number; customers: number }>({
    products: 0,
    suppliers: 0,
    orders: 0,
    customers: 0,
  });

  useEffect(() => {
    // Fetch counts on component mount
    appDataService.fetchCounts()
      .then((data: Counts) => {
        setCounts({
          products: data.products || 0,
          suppliers: data.suppliers || 0,
          orders: data.orders || 0,
          customers: data.customers || 0,
        });
      })
      .catch((error: any) => console.error("Failed to fetch counts:", error));
  }, []);

  // Function to render the selected section
  const renderSection = () => {
    switch (activeSection) {
      case "products":
        return <Products />;
      case "suppliers":
        return <Suppliers />;
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Hello Avengers !! Key Insights are now available</h1>

      <div className="tiles-container">
        <div className={`tile tile-products ${activeSection === "products" ? "active" : ""}`} onClick={() => setActiveSection("products")}>
          <div className="tiles-head">   
            <img src='/assets/Products.png' alt="Products" />
            <span className="tile-label">Products</span>
          </div>
          <span className="tile-value">{counts.products}</span>
          <img className="graph" src='/assets/product_graph.png' alt="product-graph" />
        </div>
        <div className={`tile tile-suppliers ${activeSection === "suppliers" ? "active" : ""}`} onClick={() => setActiveSection("suppliers")}>
          <div className="tiles-head"> 
            <img src='/assets/icons8-supplier-50.png' alt="Suppliers" />
            <span className="tile-label">Suppliers</span>
          </div>
          <span className="tile-value">{counts.suppliers}</span>
          <img className="graph" src='/assets/supplier_graph.png' alt="supplier-graph" />
        </div>
        <div className={`tile tile-orders ${activeSection === "orders" ? "active" : ""}`} onClick={() => setActiveSection("orders")}>
          <div className="tiles-head">
            <img src='/assets/Orders.png' alt="Orders" />
            <span className="tile-label">Orders</span>
          </div>
          <span className="tile-value">{counts.orders}</span>
          <img className="graph" src='/assets/product_graph.png' alt="product-graph" />
        </div>
        <div className={`tile tile-customers ${activeSection === "customers" ? "active" : ""}`} onClick={() => setActiveSection("customers")}>
        <div className="tiles-head">
          <img src='/assets/Customers.png' alt="Customers" />
          <span className="tile-label">Customers</span>
        </div>
        <span className="tile-value">{counts.customers}</span>
        <img className="graph" src='/assets/product_graph.png' alt="product-graph" />
        </div>
      </div>

      <div className="dashboard-content">
      <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>

        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard;
