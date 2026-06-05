import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nuve_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (name, email, password) => {
    let role = 'user';
    let finalName = name;
    
    if (email.toLowerCase() === 'admin@gmail.com' && password === 'Natalia@Isa2026') {
      role = 'admin';
      finalName = 'Administrador';
    } else if (email.toLowerCase() === 'admin@gmail.com' && password !== 'Natalia@Isa2026') {
      return { success: false, error: 'Contraseña de administrador incorrecta' };
    }

    const newUser = { name: finalName, email, role };
    setUser(newUser);
    localStorage.setItem('nuve_user', JSON.stringify(newUser));
    return { success: true };
  };

  const loginWithGoogleMock = () => {
    const newUser = { name: 'Usuario Google', email: 'googleuser@gmail.com', role: 'user' };
    setUser(newUser);
    localStorage.setItem('nuve_user', JSON.stringify(newUser));
    return { success: true };
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nuve_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogleMock, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
