import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { SummaryResponse } from '../types/expense';
import { expenseService } from '../services/expenseService';
import { SummaryCards } from '../components/SummaryCards';
import { Loader } from '../components/Loader';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getSummary(dateRange.from, dateRange.to);
      setSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch dashboard summary');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Dashboard</h1>
          <p className="page-subtitle">
            Overview of your personal expenditures and category distribution
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchSummary}
            title="Refresh statistics"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <Link to="/expenses/new" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Filter Summary by Date Range:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="date"
            className="form-input"
            value={dateRange.from || ''}
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value || undefined }))}
            aria-label="Filter summary from date"
          />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input
            type="date"
            className="form-input"
            value={dateRange.to || ''}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value || undefined }))}
            aria-label="Filter summary to date"
          />
        </div>
        {(dateRange.from || dateRange.to) && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setDateRange({})}
          >
            Clear Range
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <Loader message="Loading dashboard insights..." />
      ) : summary ? (
        <SummaryCards summary={summary} />
      ) : (
        <div className="card empty-state">
          <p>No summary information available.</p>
        </div>
      )}
    </div>
  );
};
