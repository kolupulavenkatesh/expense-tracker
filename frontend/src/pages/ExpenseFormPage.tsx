import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { ExpenseRequest } from '../types/expense';
import { expenseService } from '../services/expenseService';
import { ExpenseForm } from '../components/ExpenseForm';
import { Loader } from '../components/Loader';

export const ExpenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [initialData, setInitialData] = useState<Partial<ExpenseRequest> | null>(
    isEditing ? null : {}
  );
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const fetchExpense = async () => {
        setLoading(true);
        setError(null);
        try {
          const expense = await expenseService.getExpenseById(Number(id));
          setInitialData({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            expenseDate: expense.expenseDate,
            description: expense.description || undefined,
          });
        } catch {
          setError('Failed to load expense details. The record might not exist.');
        } finally {
          setLoading(false);
        }
      };

      fetchExpense();
    }
  }, [id, isEditing]);

  const handleSubmit = async (data: ExpenseRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEditing && id) {
        await expenseService.updateExpense(Number(id), data);
      } else {
        await expenseService.createExpense(data);
      }
      navigate('/expenses');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save expense. Please check your input and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/expenses');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={handleCancel}
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Expenses</span>
      </button>

      <div className="card">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ fontSize: '1.5rem' }}>
            {isEditing ? 'Edit Expense Record' : 'Record New Expense'}
          </h1>
          <p className="page-subtitle">
            {isEditing
              ? 'Update the expenditure details below'
              : 'Enter title, amount, category, and date of your expenditure'}
          </p>
        </div>

        {loading ? (
          <Loader message="Loading expense details..." />
        ) : initialData ? (
          <ExpenseForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            serverError={error}
          />
        ) : (
          <div className="alert alert-danger" role="alert">
            {error || 'Unable to load record.'}
          </div>
        )}
      </div>
    </div>
  );
};
