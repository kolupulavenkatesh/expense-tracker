import React, { useState } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { Category, CATEGORIES, ExpenseRequest } from '../types/expense';
import { getTodayDateString } from '../utils/dateFormatter';

interface ExpenseFormProps {
  initialData?: Partial<ExpenseRequest>;
  onSubmit: (data: ExpenseRequest) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  expenseDate?: string;
  description?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = null,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(
    initialData?.amount !== undefined ? String(initialData.amount) : ''
  );
  const [category, setCategory] = useState<Category | ''>(
    initialData?.category || 'FOOD'
  );
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expenseDate || getTodayDateString()
  );
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!expenseDate) {
      newErrors.expenseDate = 'Expense date is required';
    }

    if (description && description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const payload: ExpenseRequest = {
      title: title.trim(),
      amount: parseFloat(amount),
      category: category as Category,
      expenseDate,
      description: description.trim() ? description.trim() : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container">
      {serverError && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          placeholder="e.g. Lunch with team, Electric bill"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="form-error" role="alert">
            <AlertCircle size={14} />
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Amount ($) <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          step="0.01"
          min="0.01"
          className="form-input"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <p id="amount-error" className="form-error" role="alert">
            <AlertCircle size={14} />
            {errors.amount}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <select
          id="category"
          name="category"
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? 'category-error' : undefined}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" className="form-error" role="alert">
            <AlertCircle size={14} />
            {errors.category}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="expenseDate" className="form-label">
          Date <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          type="date"
          id="expenseDate"
          name="expenseDate"
          className="form-input"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          aria-invalid={!!errors.expenseDate}
          aria-describedby={errors.expenseDate ? 'expenseDate-error' : undefined}
        />
        {errors.expenseDate && (
          <p id="expenseDate-error" className="form-error" role="alert">
            <AlertCircle size={14} />
            {errors.expenseDate}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          rows={3}
          placeholder="Additional notes about this expenditure..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="form-error" role="alert">
            <AlertCircle size={14} />
            {errors.description}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X size={16} />
          Cancel
        </button>
        <button
          type="submit"
          id="submit-expense-btn"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <Check size={16} />
          {isSubmitting ? 'Saving...' : initialData?.title ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};
