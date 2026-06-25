import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Bookmark } from 'lucide-react';
import { formatCOP } from '../utils/format';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="glass-panel" style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'var(--transition)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      cursor: 'pointer',
      position: 'relative'
    }} onClick={handleCardClick}>
      
      {product.discount > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'var(--color-accent)',
          color: 'white',
          padding: '0.3rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          zIndex: 10,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          -{product.discount}%
        </div>
      )}

      <div style={{
        height: '250px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'var(--transition)',
            filter: isOutOfStock ? 'grayscale(30%)' : 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255,255,255,0.8)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: 'var(--color-secondary)'
        }}>
          {product.category}
        </span>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{product.name}</h3>
        {product.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', flexGrow: 1, marginBottom: '1rem', lineHeight: '1.4' }}>
            {product.description.length > 70 ? `${product.description.substring(0, 70)}...` : product.description}
          </p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {product.discount > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                {formatCOP(product.price)}
              </span>
            )}
            <span style={{ fontWeight: '700', fontSize: '1.2rem', color: product.discount > 0 ? 'var(--color-accent)' : 'var(--color-text)' }}>
              {formatCOP(discountedPrice)}
            </span>
          </div>
          
          <button 
            className={isOutOfStock ? "btn-outline" : "btn-primary"}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderColor: isOutOfStock ? 'var(--color-accent)' : undefined, color: isOutOfStock ? 'var(--color-accent)' : undefined }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, price: discountedPrice, isPreorder: isOutOfStock });
            }}
          >
            {isOutOfStock ? (
              <><Bookmark size={16} /> Reservar</>
            ) : (
              <><Plus size={16} /> Agregar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
