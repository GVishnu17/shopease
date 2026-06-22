import React from 'react';

export default function Filters({ categories, activeCategory, onCategoryChange, searchTerm, onSearchChange }) {
  return (
    <div className="filters">
      <input
        type="text"
        className="filters__search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="filters__categories">
        <button
          className={`filters__chip ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => onCategoryChange('All')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filters__chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
