import React, { useState, useMemo } from 'react';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

const MAX_PRICE = Math.ceil(Math.max(...products.map((product) => product.price)));

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      return matchesCategory && matchesSearch && matchesPrice;
    });

    switch (sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [activeCategory, maxPrice, searchTerm, sortBy]);

  return (
    <main className="home">
      <div className="home__header">
        <h1>Shop Our Products</h1>
        <p>{filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} found</p>
      </div>

      <Filters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        maxPriceLimit={MAX_PRICE}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="home__empty">No products match your search.</p>
      )}
    </main>
  );
}
