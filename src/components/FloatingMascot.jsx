import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './FloatingMascot.css';
import { X, ShoppingBag, Percent, HelpCircle } from 'lucide-react';
import mascotImg from '../assets/animado.png';

const FloatingMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('¡Hola, beauty! ¿Necesitas ayuda en algo?');
  const [isWinking, setIsWinking] = useState(false);
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();

  useEffect(() => {
    // Lógica de Saludo
    const hasGreeted = sessionStorage.getItem('mascot-greeted');
    if (!hasGreeted) {
      setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('mascot-greeted', 'true');
      }, 2000);
    }

    // Escuchar mensajes contextuales
    const handleMascotMessage = (e) => {
      setMessage(e.detail);
      setIsOpen(true);
    };

    window.addEventListener('mascot-message', handleMascotMessage);

    // Lógica de Guiño (Wink) aleatorio
    const winkInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance to wink every 6 seconds
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 200);
      }
    }, 6000);

    return () => {
      window.removeEventListener('mascot-message', handleMascotMessage);
      clearInterval(winkInterval);
    };
  }, []);

  const handleAction = (action) => {
    if (action === 'cart') {
      setIsCartOpen(true);
    } else if (action === 'offers') {
      navigate('/');
      setTimeout(() => window.dispatchEvent(new Event('filter-offers')), 100);
    } else if (action === 'help') {
      alert("¡Claro! Puedes escribirnos a nuestro WhatsApp para atención personalizada.");
      // window.open('https://wa.me/...', '_blank');
    }
    setIsOpen(false);
  };

  return (
    <div className={`floating-mascot-container ${isOpen ? 'open' : 'hidden'}`}>
      {isOpen && (
        <div className="mascot-dialogue glass-panel fade-in">
          <button className="close-dialogue" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
          
          <p style={{ fontWeight: '500', color: 'var(--color-text)', margin: 0, paddingRight: '1rem' }}>
            {message}
          </p>

          <div className="mascot-menu">
            <button onClick={() => handleAction('offers')}>
              <Percent size={16} /> Ver ofertas
            </button>
            <button onClick={() => handleAction('cart')}>
              <ShoppingBag size={16} /> Ir al carrito
            </button>
            <button onClick={() => handleAction('help')}>
              <HelpCircle size={16} /> Ayuda
            </button>
          </div>
        </div>
      )}
      
      <div className="mascot-avatar" onClick={() => setIsOpen(!isOpen)}>
        <img 
          src={mascotImg} 
          alt="Mascota NUVÉ" 
          className={`mascot-img pulse-animation ${isWinking ? 'wink' : ''}`} 
        />
      </div>
    </div>
  );
};

export default FloatingMascot;
