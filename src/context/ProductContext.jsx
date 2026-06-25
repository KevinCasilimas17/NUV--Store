import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const productsCollection = collection(db, 'products');

  useEffect(() => {
    // Usamos onSnapshot para escuchar los cambios en tiempo real
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product) => {
    try {
      await addDoc(productsCollection, product);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const productDoc = doc(db, 'products', id);
      await updateDoc(productDoc, updatedFields);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};
