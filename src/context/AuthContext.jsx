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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Formatear el usuario basado en nuestro sistema
        const role = session.user.email === 'admin@gmail.com' ? 'admin' : 'user';
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
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogleMock, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
