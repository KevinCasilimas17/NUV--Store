import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, loginWithGoogleMock } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Si es admin, no importa si está en registro o login, intentamos loguear
    const finalName = isRegistering ? name : (email === 'admin@gmail.com' ? 'Admin' : 'Usuario');
    
    const result = login(finalName, email, password);
    
    if (result.success) {
      if (email.toLowerCase() === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogleMock();
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <Logo size="large" />
        </div>
        
        <h2 style={{ marginBottom: '0.5rem' }}>{isRegistering ? 'Crea tu cuenta' : 'Inicia Sesión'}</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
          {isRegistering ? 'Únete a NUVÉ y descubre tu belleza.' : 'Bienvenida de nuevo a NUVÉ.'}
        </p>
        
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            background: '#ffcdd2', 
            padding: '0.5rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Tu Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required={isRegistering}
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            {isRegistering ? 'Crear cuenta con NUVÉ' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', position: 'relative', textAlign: 'center' }}>
          <span style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            padding: '0 10px', 
            color: 'var(--color-text-light)', 
            fontSize: '0.9rem',
            position: 'relative',
            zIndex: 1
          }}>O</span>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            right: 0, 
            borderTop: '1px solid rgba(109, 76, 65, 0.2)',
            zIndex: 0
          }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn-outline" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            background: 'white'
          }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="18" />
          Continuar con Google
        </button>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }} 
            style={{ 
              color: 'var(--color-secondary)', 
              fontWeight: 'bold', 
              marginLeft: '0.5rem',
              textDecoration: 'underline' 
            }}
          >
            {isRegistering ? 'Inicia sesión aquí' : 'Crea una aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
