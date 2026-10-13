import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { ExpenseTable } from '../components/ExpenseTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loader } from '../components/Loader';

export const ExpensesPage: React.FC = () => {
  const {
    expenses,
    loading,
    error,
    filters,
    setFilters,
    deleteExpense,
  } = useExpenses();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteRequest = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId == null) return;
    setIsDeleting(true);
    await deleteExpense(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expense Transactions</h1>
          <p className="page-subtitle">
            Search, filter, and manage all your logged daily expenditures
          </p>
        </div>

        <Link to="/expenses/new" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Add Expense</span>
        </Link>
      </div>

      <SearchFilterBar
        filters={filters}
        onFilterChange={(newFilters) => setFilters(newFilters)}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <Loader message="Loading expense records..." />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'}
            </span>
          </div>
          <ExpenseTable
            expenses={expenses}
            onDelete={handleDeleteRequest}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Expense"
        message="Are you sure you want to permanently delete this expense? This action cannot be undone."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDanger={true}
      />
    </div>
  );
};
