import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Wallet, LayoutDashboard, ReceiptText, PlusCircle } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <header className="navbar">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <span>ExpenseTracker</span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutDashboard size={16} />
              Dashboard
            </span>
          </NavLink>
          <NavLink
            to="/expenses"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ReceiptText size={16} />
              Expenses
            </span>
          </NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/expenses/new" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </Link>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
