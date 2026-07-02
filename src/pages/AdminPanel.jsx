import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useProducts } from '../context/ProductContext';
import { formatCOP } from '../utils/format';
import { Plus, Edit, Trash, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '../config/supabase';

const AdminPanel = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initialForm = {
    name: '',
    description: '',
    usage: '',
    category: 'Labiales',
    price: '',
    stock: '',
    discount: 0,
    image: '',
    shipping: false,
    variants: []
  };

  const [formData, setFormData] = useState(initialForm);

  const categories = ['Labiales', 'Bases', 'Sombras', 'Rubores', 'Skincare', 'Brochas', 'Ojos'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...(formData.variants || []), { id: Date.now().toString(), name: '', image: '', file: null }]
    });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    if (field === 'file' && value) {
      newVariants[index].image = URL.createObjectURL(value);
    }
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image;

    // Subir imagen principal
    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_main.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        imageUrl = data.publicUrl;
      } catch (error) {
        console.error("Error subiendo la imagen principal", error);
        alert("Error subiendo la imagen, intenta de nuevo.");
        setUploading(false);
        return;
      }
    }

    // Subir imágenes de variantes
    let processedVariants = [];
    if (formData.variants && formData.variants.length > 0) {
      processedVariants = await Promise.all(formData.variants.map(async (v) => {
        if (v.file) {
          const fileExt = v.file.name.split('.').pop();
          const fileName = `${Date.now()}_variant_${v.id}.${fileExt}`;
          const filePath = `variants/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, v.file);

          if (uploadError) {
             console.error("Error subiendo imagen de variante", uploadError);
             return { id: v.id, name: v.name, image: v.image };
          }

          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

          return { id: v.id, name: v.name, image: data.publicUrl };
        }
        return { id: v.id, name: v.name, image: v.image };
      }));
    }

    const productData = {
      ...formData,
      image: imageUrl,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      discount: parseInt(formData.discount || 0, 10),
      variants: processedVariants
    };

    if (isEditing) {
      await updateProduct(currentProduct.id, productData);
      setIsEditing(false);
      setCurrentProduct(null);
    } else {
      await addProduct(productData);
    }
    
    setFormData(initialForm);
    setImageFile(null);
    setUploading(false);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setImageFile(null);
    setFormData({
      name: product.name,
      description: product.description || '',
      usage: product.usage || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      discount: product.discount || 0,
      image: product.image,
      shipping: product.shipping || false,
      variants: product.variants || []
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setImageFile(null);
    setFormData(initialForm);
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Panel de Administración</h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Formulario */}
          <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
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

              <textarea
                placeholder="Modo de Uso"
                className="input-field"
                value={formData.usage}
                onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                rows="2"
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
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Precio (COP)</label>
                  <input
                    type="number"
                    placeholder="Precio"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    className="input-field"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Descuento (%)</label>
                <input
                  type="number"
                  placeholder="Ej: 15"
                  className="input-field"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  min="0" max="100"
                />
              </div>

              <div style={{ border: '2px dashed rgba(109, 76, 65, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={32} color="var(--color-secondary)" />
                  <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    {formData.image ? 'Cambiar imagen principal' : 'Subir imagen principal (JPG/PNG)'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                {formData.image && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              {/* Sección de Variantes */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(109, 76, 65, 0.1)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Tonos / Variantes</h3>
                  <button type="button" onClick={addVariant} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                    <Plus size={14} style={{ display: 'inline' }} /> Añadir
                  </button>
                </div>
                
                {formData.variants && formData.variants.map((v, index) => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Nombre (ej. Beige)" 
                      className="input-field" 
                      style={{ padding: '0.5rem', flex: 1 }}
                      value={v.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      required
                    />
                    
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'white', borderRadius: '4px', border: '1px solid #ddd' }} title="Subir foto del tono">
                      {v.image ? (
                        <img src={v.image} alt="Tono" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <ImageIcon size={16} color="var(--color-text-light)" />
                      )}
                      <input type="file" accept="image/*" onChange={(e) => updateVariant(index, 'file', e.target.files[0])} style={{ display: 'none' }} />
                    </label>

                    <button type="button" onClick={() => removeVariant(index)} style={{ color: '#d32f2f', padding: '0.5rem' }}>
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {formData.variants && formData.variants.length === 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>No hay tonos agregados. El producto será único.</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1 }} disabled={uploading}>
                  {uploading && <span>Guardando...</span>}
                  {!uploading && isEditing && <span>Guardar Cambios</span>}
                  {!uploading && !isEditing && <span><Plus size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Agregar</span>}
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
                  <th style={{ padding: '1rem 0' }}>Detalles</th>
                  <th style={{ padding: '1rem 0' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(109, 76, 65, 0.1)' }}>
                    <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontWeight: '500' }}>{product.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                          Stock: {product.stock} {product.stock === 0 && <span style={{ color: '#d32f2f' }}>(Agotado)</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                      <div>Precio: {formatCOP(product.price)}</div>
                      {product.discount > 0 && <div style={{ color: 'var(--color-accent)' }}>Descuento: {product.discount}%</div>}
                      {product.variants && product.variants.length > 0 && <div>Tonos: {product.variants.length}</div>}
                    </td>
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
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
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
