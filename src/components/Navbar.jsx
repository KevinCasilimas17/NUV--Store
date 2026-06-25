import React from 'react';
import { ShoppingBag, LogOut, Settings, User, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = ({ onSearchChange }) => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.5)',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Logo size="small" />
          <button 
            onClick={() => navigate('/')} 
            title="Ir al inicio"
            style={{ 
              color: 'var(--color-accent)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem',
              background: 'rgba(216, 161, 196, 0.15)',
              padding: '0.4rem 0.7rem',
              borderRadius: '8px',
              border: '1px solid rgba(216, 161, 196, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(216, 161, 196, 0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(216, 161, 196, 0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Home size={18} /> Inicio
          </button>
          {onSearchChange && (
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-field"
              style={{ width: '250px', display: 'none' }} // Se podría mostrar en desktop
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--color-text)' }}>
                Bienvenida/o, {user?.name || user?.email?.split('@')[0]}
              </span>
              
              {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin')} style={{ color: 'var(--color-accent)' }}>
                  <Settings size={20} />
                </button>
              )}

              <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', color: 'var(--color-accent)' }}>
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '1px solid white'
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button onClick={handleLogout} style={{ color: 'var(--color-text-light)' }} title="Cerrar sesión">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', color: 'var(--color-accent)' }}>
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '1px solid white'
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/login')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <User size={16} /> Iniciar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
