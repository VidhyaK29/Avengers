import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Customers from './Customers';
import {appDataService} from '../../services/app.data.service';
import { Customer } from '../../interfaces/common.interface';

jest.mock('../../services/app.data.service');

const mockCustomers: Customer[] = [
  { name: 'John Doe', email: 'john@example.com', address: '123 Main St', phone: '123-456-7890' },
  { name: 'Jane Smith', email: 'jane@example.com', address: '456 Elm St', phone: '987-654-3210' }
];

describe('Customers Component', () => {
  test('renders loading state initially', async () => {
    (appDataService.fetchCustomers as jest.Mock).mockResolvedValue(mockCustomers);
    render(<Customers />);
    expect(screen.getByText(/loading customers list/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading customers list/i)).not.toBeInTheDocument());
  });

  test('renders customers table when data is fetched successfully', async () => {
    (appDataService.fetchCustomers as jest.Mock).mockResolvedValue(mockCustomers);
    render(<Customers />);

    await screen.findByText('John Doe');
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    (appDataService.fetchCustomers as jest.Mock).mockRejectedValue(new Error('API failure'));
    render(<Customers />);

    await screen.findByText(/failed to load customers/i);
  });
});