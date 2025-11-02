 import React from 'react';
 import { render, screen, fireEvent } from '@testing-library/react';
 import RegistrationForm from '../RegistrationForm';
 describe('RegistrationForm', () => {
 test('renders correctly and matches snapshot', () => {
 const { asFragment } = render(<RegistrationForm onSubmit={jest.fn()} />);
 expect(asFragment()).toMatchSnapshot();
 });
  test('validates inputs and enables submit button when valid', () => {
 render(<RegistrationForm onSubmit={jest.fn()} />);
 const loginInput = screen.getByLabelText(/login/i);
 const emailInput = screen.getByLabelText(/email/i);
 const passwordInput = screen.getByLabelText(/password/i);
 const submitButton = screen.getByRole('button', { name: /register/i });
 // Initially, the button should be disabled
 expect(submitButton).toBeDisabled();
 // Fill in valid data
 
 fireEvent.change(loginInput, { target: { value: 'TestUser' } });

 fireEvent.blur(loginInput);
 
 fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
 
 fireEvent.blur(emailInput);
 
 fireEvent.change(passwordInput, { target: { value: 'password123' } });
 
 fireEvent.blur(passwordInput);
 // Button should now be enabled
 expect(submitButton).not.toBeDisabled();
 });
 });
