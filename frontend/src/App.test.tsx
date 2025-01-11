import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

test('renders the app and navigates through routes', async () => {
  render(
      <App />
  );

  // Test if the Home component renders correctly
  expect(screen.getByText(/Welcome To FizzBuzz Game!/i)).toBeInTheDocument();

  // Test if Register button works
  fireEvent.click(screen.getByText(/Register/i));
  expect(screen.getByText(/Please input your details to register and create your first game/i)).toBeInTheDocument();

  // Test if Login button works (using getByRole for better match)
  const loginButton = screen.getByRole('button', { name: /login/i }) // Ensure button is accessible
  fireEvent.click(loginButton);
  expect(screen.getByText(/Please input your details to login/i)).toBeInTheDocument();
});
