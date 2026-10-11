import React from 'react';

export default function Filters({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
  maxPriceLimit,
}) {
  return (
    <div className="filters">
      <div className="filters__toolbar">
        <input
          type="text"
          className="filters__search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select className="filters__sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="filters__price">
        <label htmlFor="max-price">Max price: ${maxPrice.toFixed(2)}</label>
        <input
          id="max-price"
          type="range"
          min="10"
          max={maxPriceLimit}
          step="5"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        />
      </div>

      <div className="filters__categories">
        <button
          type="button"
          className={`filters__chip ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => onCategoryChange('All')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            type="button"
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
