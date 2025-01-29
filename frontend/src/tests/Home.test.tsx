import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrap the component in Router to handle navigation
import Home from '../components/Home'; // Adjust the import based on your file structure
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

// Mock the `useNavigate` hook from `react-router-dom`
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep other exports as is
  useNavigate: jest.fn(), // Mock `useNavigate`
}));

describe('Home Component', () => {
  test('renders home page with header and buttons', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Check if the header text is rendered
    const header = screen.getByText(/Welcome To FizzBuzz Game!/i);
    expect(header).toBeInTheDocument();

    // Check if the subheading is rendered
    const subheading = screen.getByText(/Ready for some fun?/i);
    expect(subheading).toBeInTheDocument();

    // Check if the Register button is present
    const registerButton = screen.getByRole('button', { name: /Register/i });
    expect(registerButton).toBeInTheDocument();

    // Check if the Member Login button is present
    const loginButton = screen.getByRole('button', { name: /Member Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('navigates to /register when Register button is clicked', () => {
    const navigate = jest.fn(); // Create a mock function for navigate

    // Type assertion for `useNavigate` to ensure it's treated as a mock function
    (useNavigate as jest.Mock).mockReturnValue(navigate); 

    render(
      <Router>
        <Home />
      </Router>
    );

    // Get the Register button and click it
    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);

    // Check if navigate was called with the correct argument
    expect(navigate).toHaveBeenCalledWith('/register');
  });

  test('navigates to /login when Member Login button is clicked', () => {
    const navigate = jest.fn(); // Create a mock function for navigate

    // Type assertion for `useNavigate` to ensure it's treated as a mock function
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <Router>
        <Home />
      </Router>
    );

    // Get the Member Login button and click it
    const loginButton = screen.getByRole('button', { name: /Member Login/i });
    fireEvent.click(loginButton);

    // Check if navigate was called with the correct argument
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
