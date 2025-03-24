import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {appDataService} from '../../services/app.data.service';
import { Product } from '../../interfaces/common.interface';
import ProductList from './Products';

jest.mock('../../services/app.data.service');

const mockProducts: Product[] = [
  { name: 'Product One', dimensions: '10x10x10', price: 100, weight: '1kg' },
  { name: 'Product Two', dimensions: '20x20x20', price: 200, weight: '2kg' }
];

describe('ProductList Component', () => {
  test('renders loading state initially', async () => {
    (appDataService.fetchProducts as jest.Mock).mockResolvedValue(mockProducts);
    render(<ProductList />);
    expect(screen.getByText(/loading products list/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading products list/i)).not.toBeInTheDocument());
  });

  test('renders product table when data is fetched successfully', async () => {
    (appDataService.fetchProducts as jest.Mock).mockResolvedValue(mockProducts);
    render(<ProductList />);

    await screen.findByText('Product One');
    expect(screen.getByText('Product Two')).toBeInTheDocument();
    expect(screen.getByText('10x10x10')).toBeInTheDocument();
    expect(screen.getByText('20x20x20')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    (appDataService.fetchProducts as jest.Mock).mockRejectedValue(new Error('API failure'));
    render(<ProductList />);

    await screen.findByText(/failed to load products/i);
  });
});
