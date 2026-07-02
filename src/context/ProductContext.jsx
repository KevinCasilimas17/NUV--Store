import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Suscripción en tiempo real a los cambios en la tabla 'products'
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Change received!', payload);
          fetchProducts(); // Refrescar los productos ante cualquier cambio
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addProduct = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([product]);
        
      if (error) throw error;
      // No necesitamos llamar fetchProducts porque la suscripción lo hará
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedFields)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};
