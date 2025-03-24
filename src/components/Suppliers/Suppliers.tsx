import React, { useEffect, useState } from 'react';
import Table from '../../shared/components/Table';
import {appDataService} from '../../services/app.data.service';
import { TABLE_COLUMNS } from '../../constants/app.constant';
import { Supplier } from '../../interfaces/common.interface';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data: Supplier[] = await appDataService.fetchSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError('Failed to load suppliers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Transform Supplier[] into a format that matches TableProps.data
  const transformedData = suppliers.map((supplier) => ({
    name: supplier.name || "", // Ensure it's always a string
    email: supplier.email || supplier.contact_email || "", // Default to empty string
    address: supplier.address || supplier.location || "", // Default to empty string
    phone: supplier.phone || supplier.contact_phone || "" // Default to empty string
  }));
  

  const renderContent = () => {
    if (loading) {
      return <p>Loading suppliers list...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    return (
      <Table
        data={transformedData} // Pass transformed data
        columns={TABLE_COLUMNS.SUPPLIER_COLUMN}
        className="Suppliers"
        searchPlaceholder="Search suppliers..."
        itemsPerPage={10}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default Suppliers;
