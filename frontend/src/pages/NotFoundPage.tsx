import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="card empty-state" style={{ marginTop: '3rem' }}>
      <div className="empty-icon" style={{ width: '4rem', height: '4rem', color: 'var(--primary)' }}>
        <FileQuestion size={36} />
      </div>
      <h1 className="page-title" style={{ fontSize: '1.75rem' }}>404 - Page Not Found</h1>
      <p className="empty-desc">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        <Home size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
