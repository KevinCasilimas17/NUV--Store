import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { formatCOP } from '../utils/format';
import { Plus, Minus, ArrowLeft, Truck, ShieldCheck, Bookmark } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState(null);

  const product = products.find(p => p.id.toString() === id);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0 && !selectedVariant) {
        setSelectedVariant(product.variants[0]);
      }
      
      // Notificar a la mascota
      window.dispatchEvent(new CustomEvent('mascot-message', { 
        detail: `¡Ese ${product.category} te va a encantar! ¿Necesitas saber más?`
      }));
    }
  }, [product]);

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

  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: discountedPrice,
      isPreorder: isOutOfStock,
      selectedVariant: selectedVariant ? selectedVariant.name : null,
      cartImage: selectedVariant?.image || product.image
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
  };

  const currentImage = selectedVariant?.image || product.image;

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
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '1rem', overflow: 'hidden', position: 'relative' }}>
              {product.discount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'var(--color-accent)',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  -{product.discount}% OFF
                </div>
              )}
              <img 
                src={currentImage} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', objectFit: 'cover', aspectRatio: '1/1', filter: isOutOfStock ? 'grayscale(30%)' : 'none' }} 
              />
            </div>
            
            {/* Variantes Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>Selecciona un tono:</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: selectedVariant?.id === v.id ? '2px solid var(--color-secondary)' : '1px solid transparent',
                        background: 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        minWidth: '60px'
                      }}
                    >
                      {v.image && (
                        <img src={v.image} alt={v.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <span style={{ fontSize: '0.8rem', fontWeight: selectedVariant?.id === v.id ? 'bold' : 'normal' }}>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>{product.name}</h1>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: product.discount > 0 ? 'var(--color-accent)' : 'var(--color-text)', margin: 0 }}>
                {formatCOP(discountedPrice)}
              </p>
              {product.discount > 0 && (
                <span style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                  {formatCOP(product.price)}
                </span>
              )}
            </div>

            {isOutOfStock && (
              <div style={{ padding: '0.8rem', background: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500' }}>
                Este producto se encuentra agotado actualmente. Puedes hacer una reserva.
              </div>
            )}
            
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
              
              <button 
                className={isOutOfStock ? "btn-outline" : "btn-primary"} 
                style={{ flexGrow: 1, fontSize: '1.1rem', borderColor: isOutOfStock ? 'var(--color-accent)' : undefined, color: isOutOfStock ? 'var(--color-accent)' : undefined }} 
                onClick={handleAddToCart}
              >
                {isOutOfStock ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Bookmark size={20} /> Hacer Reserva</span>
                ) : (
                  'Agregar al Carrito'
                )}
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
