import React, { useEffect, useState } from 'react';
import Table from '../../shared/components/Table';
import {appDataService} from '../../services/app.data.service';
import { TABLE_COLUMNS } from '../../constants/app.constant';
import { Order } from '../../interfaces/common.interface';
import { format } from 'date-fns'; 

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data: Order[] = await appDataService.fetchOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const transformedData = orders.map((order) => {
    let formattedDate = "N/A"; // Default value for invalid dates
  
    if (order.date) {
      const parsedDate = new Date(order.date);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = format(parsedDate, "dd-MMM-yyyy");
      }
    }
  
    return {
      id: order.id,
      date: formattedDate, // Use validated & formatted date
      status: order.status,
      total: order.total,
    };
  });
  

  const renderContent = () => {
    if (loading) {
      return <p>Loading orders list...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    return (
      <Table
        data={transformedData}
        columns={TABLE_COLUMNS.ORDER_COLUMN}
        className="Orders"
        searchPlaceholder="Search orders..."
        itemsPerPage={10}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default Orders;
