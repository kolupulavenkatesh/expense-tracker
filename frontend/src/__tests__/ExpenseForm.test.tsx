import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExpenseForm } from '../components/ExpenseForm';

describe('ExpenseForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    // Clear any default values if present (e.g. title is initially blank)
    const titleInput = screen.getByLabelText(/Title/i);
    const amountInput = screen.getByLabelText(/Amount/i);

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(amountInput, { target: { value: '' } });

    // Click submit button
    const submitBtn = screen.getByRole('button', { name: /Save Expense/i });
    fireEvent.click(submitBtn);

    // Verify validation error messages are displayed
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(await screen.findByText('Amount is required')).toBeInTheDocument();

    // Verify onSubmit was not called
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error when amount is zero or negative', async () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    const titleInput = screen.getByLabelText(/Title/i);
    const amountInput = screen.getByLabelText(/Amount/i);

    fireEvent.change(titleInput, { target: { value: 'Coffee' } });
    fireEvent.change(amountInput, { target: { value: '-5.00' } });

    const submitBtn = screen.getByRole('button', { name: /Save Expense/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Amount must be greater than 0')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
