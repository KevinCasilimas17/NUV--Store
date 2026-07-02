import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { useProducts } from '../context/ProductContext';

const CATEGORIES = ['Todos', 'Ofertas', 'Labiales', 'Bases', 'Sombras', 'Rubores', 'Skincare', 'Brochas', 'Ojos'];

const Store = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const handleFilterOffers = () => {
      setActiveCategory('Ofertas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('filter-offers', handleFilterOffers);
    return () => window.removeEventListener('filter-offers', handleFilterOffers);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = false;
    if (activeCategory === 'Todos') {
      matchesCategory = true;
    } else if (activeCategory === 'Ofertas') {
      matchesCategory = p.discount && p.discount > 0;
    } else {
      matchesCategory = p.category === activeCategory;
    }

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
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.9rem',
                  borderColor: cat === 'Ofertas' ? 'var(--color-accent)' : undefined,
                  color: cat === 'Ofertas' && activeCategory !== 'Ofertas' ? 'var(--color-accent)' : undefined
                }}
              >
                {cat === 'Ofertas' ? '🔥 Ofertas' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
            No se encontraron productos en esta categoría.
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
