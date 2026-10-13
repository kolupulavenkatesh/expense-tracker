import React from 'react';
import { DollarSign, Layers, Calendar, PieChart } from 'lucide-react';
import { SummaryResponse } from '../types/expense';
import { formatCurrency } from '../utils/currencyFormatter';

interface SummaryCardsProps {
  summary: SummaryResponse;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const totalAmount = summary.totalAmount || 0;

  // Category breakdown calculation
  const categoryEntries = Object.entries(summary.categoryBreakdown || {})
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div>
      <div className="summary-grid">
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Spent</span>
            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(summary.totalAmount)}</div>
          <p className="stat-desc">Lifetime recorded expenses</p>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">Number of Expenses</span>
            <div className="stat-icon">
              <Layers size={20} />
            </div>
          </div>
          <div className="stat-value">{summary.expenseCount}</div>
          <p className="stat-desc">Total logged transactions</p>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-title">This Month</span>
            <div className="stat-icon">
              <Calendar size={20} />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(summary.currentMonthTotal)}</div>
          <p className="stat-desc">Total expenditure this month</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <PieChart size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Spending by Category</h3>
        </div>

        {categoryEntries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No expense data available for category breakdown yet.
          </p>
        ) : (
          <div className="category-bars">
            {categoryEntries.map(([category, amount]) => {
              const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
              return (
                <div key={category} className="category-bar-item">
                  <div className="category-bar-label">
                    <span className={`badge badge-${category}`}>{category}</span>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.875rem' }}>
                      {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="category-progress-bg">
                    <div
                      className="category-progress-fill"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: `var(--cat-${category.toLowerCase()})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
