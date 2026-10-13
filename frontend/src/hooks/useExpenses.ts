import { useState, useEffect, useCallback } from 'react';
import { Expense, FilterParams } from '../types/expense';
import { expenseService } from '../services/expenseService';

export function useExpenses(initialFilters?: FilterParams) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>(initialFilters || {});

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpenses(filters);
      setExpenses(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch expenses');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const deleteExpense = async (id: number): Promise<boolean> => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete expense');
      }
      return false;
    }
  };

  return {
    expenses,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchExpenses,
    deleteExpense,
  };
}
