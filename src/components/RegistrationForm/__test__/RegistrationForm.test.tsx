import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from './RegistrationForm';

// Mock the registerUser function
jest.mock('../services/Auth', () => ({
  registerUser: jest.fn()
}));

import { registerUser } from '../services/Auth';

const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;

describe('RegistrationForm', () => {
  beforeEach(() => {
    mockRegisterUser.mockClear();
  });

  test('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<RegistrationForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders all form elements with correct accessibility attributes', () => {
    render(<RegistrationForm />);
    
    // Check labels and inputs are properly connected
    const loginLabel = screen.getByText('Login');
    const loginInput = screen.getByLabelText('Login');
    expect(loginLabel).toHaveAttribute('for', 'login-input');
    expect(loginInput).toHaveAttribute('id', 'login-input');
    expect(loginInput).toHaveAttribute('aria-required', 'true');

    const emailLabel = screen.getByText('Email');
    const emailInput = screen.getByLabelText('Email');
    expect(emailLabel).toHaveAttribute('for', 'email-input');
    expect(emailInput).toHaveAttribute('id', 'email-input');
    expect(emailInput).toHaveAttribute('aria-required', 'true');

    const passwordLabel = screen.getByText('Password');
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordLabel).toHaveAttribute('for', 'password-input');
    expect(passwordInput).toHaveAttribute('id', 'password-input');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');

    // Check submit button
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Register');
  });

  test('validates inputs and enables submit button when valid', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    
    const loginInput = screen.getByTestId('login-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Fill in valid data using userEvent for better simulation
    await user.type(loginInput, 'TestUser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Button should be enabled after valid input
    expect(submitButton).not.toBeDisabled();
  });

  test('shows validation errors for empty fields on submit', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    
    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByTestId('validation-message')).toBeInTheDocument();
    });
  });

  test('submits form with valid data and shows success message', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    
    mockRegisterUser.mockResolvedValue({
      success: true,
      message: 'Registration successful!',
      data: { id: '123', login: 'TestUser', email: 'test@example.com' }
    });

    render(<RegistrationForm onRegistrationSuccess={mockOnSuccess} />);
    
    const loginInput = screen.getByTestId('login-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Fill in valid data
    await user.type(loginInput, 'TestUser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Registering...');

    // Wait for success
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        login: 'TestUser',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    expect(mockOnSuccess).toHaveBeenCalledWith({
      login: 'TestUser',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('shows error message when registration fails', async () => {
    const user = userEvent.setup();
    const mockOnError = jest.fn();
    
    mockRegisterUser.mockResolvedValue({
      success: false,
      message: 'Email already exists'
    });

    render(<RegistrationForm onRegistrationError={mockOnError} />);
    
    const loginInput = screen.getByTestId('login-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Fill in valid data
    await user.type(loginInput, 'TestUser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Wait for error
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Email already exists');
    expect(mockOnError).toHaveBeenCalledWith('Email already exists');
  });

  test('disables form fields during submission', async () => {
    const user = userEvent.setup();
    
    // Mock a slow API call
    mockRegisterUser.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        message: 'Success'
      }), 100))
    );

    render(<RegistrationForm />);
    
    const loginInput = screen.getByTestId('login-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    // Fill form and submit
    await user.type(loginInput, 'TestUser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check all fields are disabled during loading
    expect(loginInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
