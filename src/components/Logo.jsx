import React from 'react';
import './Logo.css';
import logoImg from '../assets/logo.png';

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`nuve-logo-container ${size}`}>
      <img src={logoImg} alt="NUVÉ Logo" className="nuve-logo-image" />
    </div>
  );
};

export default Logo;
