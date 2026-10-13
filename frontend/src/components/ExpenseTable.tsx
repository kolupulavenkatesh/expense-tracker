import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Receipt } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDate } from '../utils/dateFormatter';

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onDelete,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon">
          <Receipt size={32} />
        </div>
        <h3 className="empty-title">No expenses found</h3>
        <p className="empty-desc">
          No records match your selected criteria. Try clearing filters or create a new expense entry.
        </p>
        <Link to="/expenses/new" className="btn btn-primary btn-sm">
          + Add New Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="table-container table-responsive-cards">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} id={`expense-row-${expense.id}`}>
              <td data-label="Date">
                <span style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(expense.expenseDate)}
                </span>
              </td>
              <td data-label="Title">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{expense.title}</span>
                  {expense.description && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {expense.description}
                    </span>
                  )}
                </div>
              </td>
              <td data-label="Category">
                <span className={`badge badge-${expense.category}`}>
                  {expense.category}
                </span>
              </td>
              <td data-label="Amount" className="amount-col">
                {formatCurrency(expense.amount)}
              </td>
              <td data-label="Actions" style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <Link
                    to={`/expenses/${expense.id}/edit`}
                    id={`edit-btn-${expense.id}`}
                    className="btn btn-secondary btn-sm btn-icon"
                    title="Edit Expense"
                    aria-label={`Edit ${expense.title}`}
                  >
                    <Edit2 size={15} />
                  </Link>
                  <button
                    type="button"
                    id={`delete-btn-${expense.id}`}
                    className="btn btn-danger btn-sm btn-icon"
                    title="Delete Expense"
                    aria-label={`Delete ${expense.title}`}
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
