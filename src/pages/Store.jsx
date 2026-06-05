import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { useProducts } from '../context/ProductContext';

const CATEGORIES = ['Todos', 'Labiales', 'Bases', 'Sombras', 'Skincare', 'Brochas'];

const Store = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Navbar onSearchChange={setSearchTerm} />
      <CartDrawer />
      
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Descubre tu belleza</h1>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
            No se encontraron productos.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
