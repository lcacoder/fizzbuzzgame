import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '../components/Register';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock environment variable
(globalThis as any).importMeta = { env: { VITE_API_URL: 'https://localhost:5020/api' } };


describe('Register Component', () => {
    let navigateMock: jest.Mock;

    beforeEach(() => {
    navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
  });

  test('renders form with all fields and submit button', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByText(/Welcome To FizzBuzz Game!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Game Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Value Range:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('shows validation errors when fields are empty', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(await screen.findByText(/Author is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Game Name is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Value Range is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Duration is required and must be a positive number./i)).toBeInTheDocument();
  });

  test('fills form correctly without validation errors', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Author:/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Game Name:/i), { target: { value: 'FizzBuzz Challenge' } });
    fireEvent.change(screen.getByLabelText(/Value Range:/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Duration:/i), { target: { value: '10' } });

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('FizzBuzz Challenge')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  test('submits the form and navigates on success', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Game created successfully!' }),
      })
    ) as jest.Mock;

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Author:/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Game Name:/i), { target: { value: 'FizzBuzz Challenge' } });
    fireEvent.change(screen.getByLabelText(/Value Range:/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Duration:/i), { target: { value: '10' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/newmember', {
        state: { author: 'John Doe', gameName: 'FizzBuzz Challenge', range: '100', timeRange: '10' },
      });
    });

    jest.restoreAllMocks();
  });

  test('displays an error when API request fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Error creating game'),
      })
    ) as jest.Mock;

    console.error = jest.fn();

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Author:/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Game Name:/i), { target: { value: 'FizzBuzz Challenge' } });
    fireEvent.change(screen.getByLabelText(/Value Range:/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Duration:/i), { target: { value: '10' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to create game:', 'Error creating game');
    });

    jest.restoreAllMocks();
  });
});
