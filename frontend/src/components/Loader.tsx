import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container" role="status" aria-label={message}>
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};
