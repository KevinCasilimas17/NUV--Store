import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Store from './pages/Store';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Store />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
