import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useProducts } from '../context/ProductContext';
import { formatCOP } from '../utils/format';
import { Plus, Edit, Trash, Image as ImageIcon } from 'lucide-react';

const AdminPanel = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Labiales',
    price: '',
    stock: '',
    image: '',
    shipping: false
  });

  const categories = ['Labiales', 'Bases', 'Sombras', 'Skincare', 'Brochas'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(currentProduct.id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });
      setIsEditing(false);
      setCurrentProduct(null);
    } else {
      addProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });
    }
    setFormData({ name: '', description: '', category: 'Labiales', price: '', stock: '', image: '', shipping: false });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      shipping: product.shipping || false
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({ name: '', description: '', category: 'Labiales', price: '', stock: '', image: '', shipping: false });
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Panel de Administración</h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Formulario */}
          <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Nombre del producto"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <textarea
                placeholder="Descripción del producto"
                className="input-field"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{ resize: 'vertical' }}
              />

              <select 
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="number"
                  placeholder="Precio (COP)"
                  className="input-field"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  className="input-field"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              {/* Opción de envíos (deshabilitada por ahora) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="shipping" 
                  checked={formData.shipping} 
                  onChange={(e) => setFormData({ ...formData, shipping: e.target.checked })}
                  disabled
                  title="Funcionalidad de envíos deshabilitada temporalmente"
                />
                <label htmlFor="shipping" style={{ color: 'var(--color-text-light)', cursor: 'not-allowed' }}>
                  Habilitar opciones de envío (Próximamente)
                </label>
              </div>
              
              <div style={{ border: '2px dashed rgba(109, 76, 65, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={32} color="var(--color-secondary)" />
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    {formData.image ? 'Cambiar imagen' : 'Subir imagen (JPG/PNG)'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                {formData.image && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                  {isEditing ? 'Guardar Cambios' : <><Plus size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Agregar</>}
                </button>
                {isEditing && (
                  <button type="button" className="btn-outline" onClick={handleCancel}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de productos */}
          <div className="glass-panel" style={{ flex: '2 1 600px', padding: '2rem', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
            <h2>Inventario</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(109, 76, 65, 0.1)' }}>
                  <th style={{ padding: '1rem 0' }}>Producto</th>
                  <th style={{ padding: '1rem 0' }}>Descripción</th>
                  <th style={{ padding: '1rem 0' }}>Precio</th>
                  <th style={{ padding: '1rem 0' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(109, 76, 65, 0.1)' }}>
                    <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <span style={{ fontWeight: '500' }}>{product.name}</span>
                    </td>
                    <td style={{ padding: '1rem 0', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-light)' }}>
                      {product.description || 'Sin descripción'}
                    </td>
                    <td style={{ padding: '1rem 0' }}>{formatCOP(product.price)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <button onClick={() => handleEdit(product)} style={{ color: 'var(--color-secondary)', marginRight: '1rem' }} title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} style={{ color: '#d32f2f' }} title="Eliminar">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                      No hay productos en el inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
