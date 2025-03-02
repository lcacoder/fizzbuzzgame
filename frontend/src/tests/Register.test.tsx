import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../components/Register';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking GameRules component
jest.mock('../components/GameRules', () => ({
  __esModule: true,
  default: () => <div>Game Rules</div>, // Mocking the default export
  rules: [
    'Replace any number divisible by 7 with "Foo"',
    'Replace any number divisible by 11 with "Boo"',
    'Replace any number divisible by 101 with "Loo"',
    'If divisible by more than one, concatenate the words (e.g., "FooBoo" for 77 which is divisible for both of 7 and 11)',
    'Otherwise, fill in the number only',
  ],
}));

// Mocking window alert and fetch
global.alert = jest.fn();
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  text: () => Promise.resolve(''),
});

describe('Register Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  it('should render the form and handle user input', () => {
    // Check form fields are rendered
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Game Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Value Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
    
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Game Name/i), { target: { value: 'FizzBuzz' } });
    fireEvent.change(screen.getByLabelText(/Value Range/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '30' } });

    expect((screen.getByLabelText(/Author/i) as HTMLInputElement).value).toBe('John Doe');
    expect((screen.getByLabelText(/Game Name/i) as HTMLInputElement).value).toBe('FizzBuzz');
    expect((screen.getByLabelText(/Value Range/i) as HTMLInputElement).value).toBe('100');
    expect((screen.getByLabelText(/Duration/i) as HTMLInputElement).value).toBe('30');
  });

  it('should show error message when required fields are empty', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Author is required.')).toBeInTheDocument();
      expect(screen.getByText('Game Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Value Range is required.')).toBeInTheDocument();
      expect(screen.getByText('Duration is required and must be a positive number.')).toBeInTheDocument();
    });
  });

  it('should show error for invalid range value', async () => {
    fireEvent.change(screen.getByLabelText(/Value Range/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid number for Range.')).toBeInTheDocument();
    });
  });

  it('should call submitInfo and navigate on successful form submission', async () => {
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Game Name/i), { target: { value: 'FizzBuzz' } });
    fireEvent.change(screen.getByLabelText(/Value Range/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '30' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5020/api/game/creategame',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(global.alert).toHaveBeenCalledWith("Game created successfully! Click Ok to start playing");
    });
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Error creating game'),
    });

    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Game Name/i), { target: { value: 'FizzBuzz' } });
    fireEvent.change(screen.getByLabelText(/Value Range/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '30' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      // Verify that the error message is not displayed in the DOM
      expect(screen.queryByText('Error creating game')).toBeNull();
    });
  });
});
