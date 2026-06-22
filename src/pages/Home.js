import React, { useState, useMemo } from 'react';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

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
