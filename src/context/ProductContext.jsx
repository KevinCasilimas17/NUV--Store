import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const initialProducts = [
  { id: '1', name: 'Labial Velvet Matte', price: 18.5, category: 'Labiales', stock: 50, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Labial de larga duración con acabado mate aterciopelado. No reseca los labios.', shipping: false },
  { id: '2', name: 'Base Luminous Silk', price: 32.0, category: 'Bases', stock: 30, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Base líquida ligera para un acabado luminoso y natural, ideal para todo tipo de piel.', shipping: false },
  { id: '3', name: 'Paleta Rose Gold', price: 45.0, category: 'Sombras', stock: 20, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Paleta de sombras con tonos cálidos y dorados, altamente pigmentados y fáciles de difuminar.', shipping: false },
  { id: '4', name: 'Sérum Glow Up', price: 28.0, category: 'Skincare', stock: 40, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Sérum hidratante con ácido hialurónico y vitamina C para una piel radiante.', shipping: false },
  { id: '5', name: 'Set de Brochas Fluffy', price: 25.0, category: 'Brochas', stock: 15, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Set de 5 brochas esenciales con cerdas sintéticas extra suaves para un maquillaje profesional.', shipping: false }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('nuve_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('nuve_products', JSON.stringify(initialProducts));
    }
  }, []);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('nuve_products', JSON.stringify(updated));
  };

  const updateProduct = (id, updatedFields) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProducts(updated);
    localStorage.setItem('nuve_products', JSON.stringify(updated));
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('nuve_products', JSON.stringify(updated));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
