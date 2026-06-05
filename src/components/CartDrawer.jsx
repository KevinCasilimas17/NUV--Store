import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    alert('¡Gracias por tu compra simulada en NUVÉ!');
    clearCart();
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(109, 76, 65, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 999
        }}
        onClick={() => setIsCartOpen(false)}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--color-bg-base)',
        boxShadow: '-4px 0 24px rgba(109, 76, 65, 0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(109, 76, 65, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem' }}>
            <ShoppingBag /> Mi Carrito
          </h2>
          <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--color-text-light)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '2rem' }}>
              Tu carrito está vacío, ¡agrega algo hermoso!
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontFamily: 'var(--font-main)' }}>{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--color-text-light)' }}><X size={16} /></button>
                  </div>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 'bold', margin: '0.5rem 0' }}>
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.2rem', background: 'rgba(216, 161, 196, 0.2)', borderRadius: '4px' }}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.2rem', background: 'rgba(216, 161, 196, 0.2)', borderRadius: '4px' }}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(109, 76, 65, 0.1)', background: 'var(--color-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleCheckout}>
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
