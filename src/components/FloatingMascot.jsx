import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './FloatingMascot.css';
import { X, ShoppingBag, Percent, HelpCircle } from 'lucide-react';
import mascotImg from '../assets/animado.png';

const WHATSAPP_NUMBER = '573113449290';

const FloatingMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
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
        setShowMenu(true);
        sessionStorage.setItem('mascot-greeted', 'true');
      }, 2000);
    }

    // Escuchar mensajes contextuales
    const handleMascotMessage = (e) => {
      setMessage(e.detail);
      setIsOpen(true);
      setShowMenu(false); // Cuando responde una pregunta, oculta el menú
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
      setIsOpen(false);
    } else if (action === 'offers') {
      navigate('/');
      setTimeout(() => window.dispatchEvent(new Event('filter-offers')), 100);
      setIsOpen(false);
    } else if (action === 'help') {
      // Redirige directamente a WhatsApp con mensaje pre-escrito
      const helpMessage = encodeURIComponent('Necesito que me des unos tips y me brindes tu ayuda');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${helpMessage}`, '_blank');
      setIsOpen(false);
    }
  };

  const handleAvatarClick = () => {
    if (isOpen) {
      // Si está abierto, al hacer click reactiva el menú
      setShowMenu(true);
    } else {
      // Si está cerrado, abre con menú visible
      setIsOpen(true);
      setShowMenu(true);
      setMessage('¡Hola, beauty! ¿Necesitas ayuda en algo?');
    }
  };

  const handleDialogueHover = () => {
    // Al pasar el mouse sobre el diálogo, muestra el menú
    if (isOpen && !showMenu) {
      setShowMenu(true);
    }
  };

  return (
    <div className={`floating-mascot-container ${isOpen ? 'open' : 'hidden'}`}>
      {isOpen && (
        <div 
          className="mascot-dialogue glass-panel fade-in"
          onMouseEnter={handleDialogueHover}
        >
          <button className="close-dialogue" onClick={() => { setIsOpen(false); setShowMenu(true); }}>
            <X size={16} />
          </button>
          
          <p style={{ fontWeight: '500', color: 'var(--color-text)', margin: 0, paddingRight: '1rem' }}>
            {message}
          </p>

          <div key="mascot-menu-container">
            {showMenu ? (
              <div className="mascot-menu fade-in">
                <button onClick={() => handleAction('offers')}>
                  <Percent size={16} /> Ver ofertas
                </button>
                <button onClick={() => handleAction('cart')}>
                  <ShoppingBag size={16} /> Ir al carrito
                </button>
                <button onClick={() => handleAction('help')}>
                  <HelpCircle size={16} /> Habla por WhatsApp
                </button>
              </div>
            ) : (
              <p className="mascot-hint fade-in" style={{ 
                fontSize: '0.75rem', 
                color: 'var(--color-text-light)', 
                margin: 0,
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Pasa el mouse encima o tócame para ver las opciones ✨
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="mascot-avatar" onClick={handleAvatarClick}>
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
