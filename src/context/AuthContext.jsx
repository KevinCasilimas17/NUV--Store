import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const ADMIN_EMAIL = 'kevincasilimas0@gmail.com';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatUser = (supabaseUser) => {
    const role = supabaseUser.email === ADMIN_EMAIL ? 'admin' : 'user';
    const name = supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0];
    return { id: supabaseUser.id, email: supabaseUser.email, name, role };
  };

  useEffect(() => {
    // 1. Obtener la sesión actual al cargar la app
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(formatUser(session.user));
      }
      setLoading(false);
    };

    fetchSession();

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(formatUser(session.user));
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
