import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Si es admin, intentamos loguear, o si es un cliente normal
    const finalName = isRegistering ? name : (email === 'admin@gmail.com' ? 'Admin' : 'Usuario');
    
    let result;
    if (isRegistering) {
      result = await register(finalName, email, password);
    } else {
      result = await login(finalName, email, password);
    }
    
    if (result.success) {
      if (email.toLowerCase() === 'kevincasilimas0@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Ocurrió un error al procesar tu solicitud.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative'
    }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          left: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: 'var(--color-text-light)', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        <ArrowLeft size={20} /> Volver a la tienda
      </button>

      <div className="glass-panel" style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        marginTop: '2rem'
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
