import React, { useEffect, useState } from 'react';
import Table from '../../shared/components/Table';
import {appDataService} from '../../services/app.data.service';
import { TABLE_COLUMNS } from '../../constants/app.constant';
import { Customer } from '../../interfaces/common.interface';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data: Customer[] = await appDataService.fetchCustomers();
        setCustomers(data);
      } catch (err) {
        setError('Failed to load customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const transformedData = customers.map((customer) => ({
    name: customer.name,
    email: customer.email,
    address: customer.address,
    phone: customer.phone
  }));

  const renderContent = () => {
    if (loading) {
      return <p>Loading customers list...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    return (
      <Table
        data={transformedData}
        columns={TABLE_COLUMNS.CUSTOMER_COLUMN}
        className="Customers"
        searchPlaceholder="Search customers..."
        itemsPerPage={10}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default Customers;
