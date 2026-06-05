import React from 'react';
import { Sparkles } from 'lucide-react';
import './Logo.css';

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`nuve-logo-container ${size}`}>
      <div className="nuve-text">
        NUVÉ
        <span className="nuve-sparkle">
          <Sparkles size={size === 'large' ? 32 : 16} fill="white" color="white" />
        </span>
      </div>
    </div>
  );
};

export default Logo;
