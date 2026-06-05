import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { formatCOP } from '../utils/format';
import { Plus, Minus, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Producto no encontrado</h2>
          <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Volver a la tienda</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div>
      <Navbar />
      <CartDrawer />
      
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}
        >
          <ArrowLeft size={20} /> Volver a la tienda
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          
          {/* Imagen del producto */}
          <div style={{ flex: '1 1 400px' }}>
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '1rem', overflow: 'hidden' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', objectFit: 'cover', aspectRatio: '1/1' }} 
              />
            </div>
          </div>

          {/* Detalles del producto */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>{product.name}</h1>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              {formatCOP(product.price)}
            </p>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {product.description || 'Sin descripción disponible para este producto.'}
            </p>

            {/* Selector de cantidad y agregar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '1px solid rgba(109, 76, 65, 0.2)', 
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 1rem',
                background: 'white'
              }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.5rem', color: 'var(--color-text-light)' }}><Minus size={18} /></button>
                <span style={{ padding: '0 1rem', fontWeight: 'bold' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.5rem', color: 'var(--color-text-light)' }}><Plus size={18} /></button>
              </div>
              <button className="btn-primary" style={{ flexGrow: 1, fontSize: '1.1rem' }} onClick={handleAddToCart}>
                Agregar al Carrito
              </button>
            </div>

            {/* Beneficios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-light)' }}>
                <Truck size={24} color="var(--color-secondary)" />
                <span>Envíos a toda Colombia {product.shipping ? '(Disponible)' : '(Pronto)'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-light)' }}>
                <ShieldCheck size={24} color="var(--color-secondary)" />
                <span>Compra 100% segura</span>
              </div>
            </div>

            {/* Pestañas (Acordeón estilo Atenea) */}
            <div style={{ borderTop: '1px solid rgba(109, 76, 65, 0.2)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(109, 76, 65, 0.1)' }}>
                <button 
                  onClick={() => setActiveTab('description')} 
                  style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'description' ? '2px solid var(--color-secondary)' : 'none', fontWeight: activeTab === 'description' ? 'bold' : 'normal' }}
                >
                  Detalles
                </button>
                <button 
                  onClick={() => setActiveTab('usage')} 
                  style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'usage' ? '2px solid var(--color-secondary)' : 'none', fontWeight: activeTab === 'usage' ? 'bold' : 'normal' }}
                >
                  Modo de Uso
                </button>
                <button 
                  onClick={() => setActiveTab('ingredients')} 
                  style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'ingredients' ? '2px solid var(--color-secondary)' : 'none', fontWeight: activeTab === 'ingredients' ? 'bold' : 'normal' }}
                >
                  Ingredientes
                </button>
              </div>
              
              <div style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                {activeTab === 'description' && (
                  <p>{product.description || 'Detalles completos no disponibles.'}</p>
                )}
                {activeTab === 'usage' && (
                  <p>Aplica una cantidad generosa del producto según tu rutina diaria. Difumina suavemente hasta lograr el acabado deseado.</p>
                )}
                {activeTab === 'ingredients' && (
                  <p>Water (Aqua), Glycerin, Silica, Dimethicone, Titanium Dioxide. Producto libre de crueldad animal.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
