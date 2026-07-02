import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener la sesión actual al cargar la app
    const fetchSession = async () => {
      // Primero revisar si hay admin guardado localmente
      const storedAdmin = localStorage.getItem('nuve_admin');
      if (storedAdmin) {
        setUser(JSON.parse(storedAdmin));
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const role = 'user';
        const name = session.user.user_metadata?.name || session.user.email.split('@')[0];
        setUser({ id: session.user.id, email: session.user.email, name, role });
      }
      setLoading(false);
    };

    fetchSession();

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const role = session.user.email === 'admin@gmail.com' ? 'admin' : 'user';
        const name = session.user.user_metadata?.name || session.user.email.split('@')[0];
        setUser({ id: session.user.id, email: session.user.email, name, role });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (name, email, password) => {
    // Caso especial: Administrador con credenciales hardcodeadas
    if (email.toLowerCase() === 'admin@gmail.com') {
      if (password === 'Natalia@Isa2026') {
        const adminUser = { id: 'admin', email: 'admin@gmail.com', name: 'Administrador', role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('nuve_admin', JSON.stringify(adminUser));
        return { success: true };
      } else {
        return { success: false, error: 'Contraseña de administrador incorrecta' };
      }
    }

    // Usuarios normales: Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogleMock = async () => {
    // Usar OAuth de Supabase si quisieran en un futuro.
    // Por ahora, como es Mock, devolvemos error amigable o redirigimos.
    return { success: false, error: "El inicio de sesión con Google estará disponible pronto." };
  };

  const logout = async () => {
    localStorage.removeItem('nuve_admin');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogleMock, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
