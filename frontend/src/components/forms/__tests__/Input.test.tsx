import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
  it('renders label and input correctly', () => {
    render(<Input label="Email" type="email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input label="Name" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when error prop is provided and touched is true', () => {
    render(
      <Input
        label="Password"
        error="Password is required"
        touched={true}
      />
    );
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('does not show error message when touched is false', () => {
    render(
      <Input
        label="Password"
        error="Password is required"
        touched={false}
      />
    );
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
  });

  it('applies error styles when error and touched are true', () => {
    render(
      <Input
        label="Username"
        error="Username is required"
        touched={true}
      />
    );
    expect(screen.getByLabelText('Username')).toHaveClass('border-red-500');
  });

  it('passes through additional props to input element', () => {
    render(
      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        data-testid="email-input"
      />
    );
    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });
}); 