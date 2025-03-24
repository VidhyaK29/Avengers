import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone";

interface Customer {
  id: string;
  name: string;
}

interface Order {
  id: string;
  customerId: string;
}

interface NodeData {
  id: string;
  label: string;
  shape: string;
  color: string;
  type: "customer" | "order";
}

interface EdgeData {
  from: string;
  to: string;
  color: string;
}

const GraphPage: React.FC = () => {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const [nodes] = useState(new DataSet<NodeData>());
  const [edges] = useState(new DataSet<EdgeData>());
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    fetch("https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev/customers/")
      .then((response) => response.json())
      .then((data: Customer[]) => {
        const customerNodes: NodeData[] = data.slice(0, 30).map((customer) => ({
          id: customer.id,
          label: customer.name,
          shape: "circle",
          color: "#173540",
          type: "customer",
        }));
        nodes.add(customerNodes);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, [nodes]);

  useEffect(() => {
    if (!graphRef.current) return;

    // Clean up previous observer if it exists
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    // Initialize network with a small delay
    const initTimeout = setTimeout(() => {
      if (!graphRef.current) return;

      const data = { nodes, edges };
      const options = {
        nodes: { 
          size: 10, 
          font: { 
            size: 14, 
            color: "#ffffff", 
            style: "bold" 
          } 
        },
        edges: { 
          arrows: "to", 
          font: { 
            align: "middle" 
          } 
        },
        physics: { 
          stabilization: {
            iterations: 50,
            updateInterval: 10
          },
          solver: 'forceAtlas2Based',
          timestep: 0.5
        },
      };

      const networkInstance = new Network(graphRef.current, data, options);
      networkRef.current = networkInstance;

      networkInstance.on("click", function (params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0] as string;
          console.log(nodeId);

          const clickedNode = nodes.get(nodeId);
          if (clickedNode && clickedNode.type === "customer") {
            loadOrdersForCustomer(nodeId);
          }
        }
      });

      // Set up ResizeObserver with debounce
      resizeObserverRef.current = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (networkRef.current) {
            // Use requestAnimationFrame to throttle resize handling
            requestAnimationFrame(() => {
              if (networkRef.current) {
                networkRef.current.redraw();
                networkRef.current.fit();
              }
            });
          }
        }
      });

      if (graphRef.current) {
        resizeObserverRef.current.observe(graphRef.current);
      }

    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [nodes, edges]);

  const loadOrdersForCustomer = (customerID: string) => {
    fetch(`https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev/customer-orders?customerId=${customerID}`)
      .then((response) => response.json())
      .then((orders: Order[]) => {
        const orderNodes: NodeData[] = orders.map((order) => ({
          id: order.id,
          label: `Order ${order.id}`,
          shape: "box",
          color: "#217373",
          type: "order",
        }));

        const orderEdges: EdgeData[] = orders.map((order) => ({
          from: customerID,
          to: order.id,
          color: "#33a02c",
        }));

        nodes.add(orderNodes);
        edges.add(orderEdges);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  };

  return (
    <div style={{ 
      height: "100vh", 
      width: "100%", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden" // Prevent container from causing resize events
    }}>
      <h2 style={{ textAlign: "center" }}>Knowledge Graph</h2>
      <div 
        ref={graphRef} 
        style={{ 
          flexGrow: 1, 
          minHeight: "500px", 
          width: "100%",
          position: "relative" // Helps with stable layout
        }} 
      />
    </div>
  );
};

export default GraphPage;