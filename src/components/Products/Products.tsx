import React, { useEffect, useState } from 'react';
import Table from '../../shared/components/Table';
import {appDataService} from '../../services/app.data.service';
import { TABLE_COLUMNS } from '../../constants/app.constant';
import { Product } from '../../interfaces/common.interface';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: Product[] = await appDataService.fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const transformedData = products.map((product) => ({
    name: product.name,
    dimensions: product.dimensions,
    price: product.price,
    weight: product.weight
  }));
  
  const renderContent = () => {
    if (loading) {
      return <p>Loading products list...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    return (
      <Table
        data={transformedData} // Pass transformed data
        columns={TABLE_COLUMNS.PRODUCT_COLUMN}
        searchPlaceholder="Search products..."
        itemsPerPage={10}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default ProductList;
