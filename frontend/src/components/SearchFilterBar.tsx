import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Category, CATEGORIES, FilterParams } from '../types/expense';

interface SearchFilterBarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({ ...filters, search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, filters, onFilterChange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Category | '';
    onFilterChange({ ...filters, category: value });
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, from: e.target.value || undefined });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, to: e.target.value || undefined });
  };

  const handleReset = () => {
    setSearchTerm('');
    onFilterChange({});
  };

  const hasActiveFilters = Boolean(
    searchTerm || filters.category || filters.from || filters.to
  );

  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          id="search-input"
          className="form-input"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search expenses"
        />
      </div>

      <div className="filter-select">
        <select
          id="category-filter"
          className="form-select"
          value={filters.category || ''}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-date-group">
        <input
          type="date"
          id="date-from"
          className="form-input"
          value={filters.from || ''}
          onChange={handleFromChange}
          aria-label="From date"
          title="From date"
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>to</span>
        <input
          type="date"
          id="date-to"
          className="form-input"
          value={filters.to || ''}
          onChange={handleToChange}
          aria-label="To date"
          title="To date"
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          id="reset-filters-btn"
          className="btn btn-secondary btn-sm"
          onClick={handleReset}
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
};
