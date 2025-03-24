import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Suppliers from './Suppliers';
import {appDataService} from '../../services/app.data.service';
import { Supplier } from '../../interfaces/common.interface';
import userEvent from '@testing-library/user-event';

jest.mock('../../services/app.data.service');

const mockSuppliers: Supplier[] = [
  { name: 'Supplier One', email: 'one@example.com', address: 'Address One', phone: '1234567890' },
  { name: 'Supplier Two', email: 'two@example.com', address: 'Address Two', phone: '0987654321' }
];

describe('Suppliers Component', () => {
  test('renders loading state initially', async () => {
    (appDataService.fetchSuppliers as jest.Mock).mockResolvedValue(mockSuppliers);
    render(<Suppliers />);
    expect(screen.getByText(/loading suppliers list/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading suppliers list/i)).not.toBeInTheDocument());
  });

  test('renders supplier table when data is fetched successfully', async () => {
    (appDataService.fetchSuppliers as jest.Mock).mockResolvedValue(mockSuppliers);
    render(<Suppliers />);

    await screen.findByText('Supplier One');
    expect(screen.getByText('Supplier Two')).toBeInTheDocument();
    expect(screen.getByText('one@example.com')).toBeInTheDocument();
    expect(screen.getByText('two@example.com')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    (appDataService.fetchSuppliers as jest.Mock).mockRejectedValue(new Error('API failure'));
    render(<Suppliers />);

    await screen.findByText(/failed to load suppliers/i);
  });
});