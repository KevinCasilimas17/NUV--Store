import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatCOP } from '../utils/format';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const WHATSAPP_NUMBER = '573113449290';

  const handleCheckout = () => {
    alert('¡Hola! Las compras automáticas en la tienda aún no están habilitadas. Serás redirigido a nuestro WhatsApp para finalizar tu pedido de forma personalizada.');

    // Generamos el texto para WhatsApp con detalle del pedido
    const text = cartItems.map(item => {
      let itemName = item.name;
      if (item.selectedVariant) itemName += ` (Tono: ${item.selectedVariant})`;
      if (item.isPreorder) itemName += ` [RESERVA]`;
      return `🛍️ ${item.quantity}x ${itemName} - ${formatCOP(item.price * item.quantity)}`;
    }).join('%0A');

    const totalText = `%0A%0A💰 *Total: ${formatCOP(total)}*`;
    const message = `¡Hola NUVÉ! 🌸 Quiero comprar esto:%0A%0A${text}${totalText}`;

    // Redirigimos a WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

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
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed rgba(109,76,65,0.1)' }}>
                <img src={item.cartImage || item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontFamily: 'var(--font-main)' }}>{item.name}</h4>
                      {item.selectedVariant && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>
                          Tono: {item.selectedVariant}
                        </div>
                      )}
                      {item.isPreorder && (
                        <div style={{ fontSize: '0.75rem', background: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem' }}>
                          Reserva
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--color-text-light)' }}><X size={16} /></button>
                  </div>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 'bold', margin: '0.5rem 0' }}>
                    {formatCOP(item.price)}
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
              <span>{formatCOP(total)}</span>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              onClick={handleCheckout}
            >
              Finalizar Compra
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.8rem' }}>
              Al finalizar, serás redirigido a WhatsApp para coordinar el pago.
            </p>
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
