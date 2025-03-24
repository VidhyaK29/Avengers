import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Orders from './Orders';
import {appDataService} from '../../services/app.data.service';
import { Order } from '../../interfaces/common.interface';
import { format } from 'date-fns';

jest.mock('../../services/app.data.service');

const mockOrders: Order[] = [
  { id: 1, date: '2024-03-10T12:00:00Z', status: 'Pending', total: '250' },
  { id: 2, date: '2024-03-15T12:00:00Z', status: 'Completed', total: '500' }
];

describe('Orders Component', () => {
  test('renders loading state initially', async () => {
    (appDataService.fetchOrders as jest.Mock).mockResolvedValue(mockOrders);
    render(<Orders />);
    expect(screen.getByText(/loading orders list/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading orders list/i)).not.toBeInTheDocument());
  });

  test('renders orders table when data is fetched successfully', async () => {
    (appDataService.fetchOrders as jest.Mock).mockResolvedValue(mockOrders);
    render(<Orders />);

    await screen.findByText('1');
    expect(screen.getByText(format(new Date('2024-03-10T12:00:00Z'), 'dd-MMM-yyyy'))).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    (appDataService.fetchOrders as jest.Mock).mockRejectedValue(new Error('API failure'));
    render(<Orders />);

    await screen.findByText(/failed to load orders/i);
  });
});