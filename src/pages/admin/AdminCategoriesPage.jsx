import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit2, Trash2, Eye, X, Image as ImageIcon, Check } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { useApp } from '../../context/AppContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { Link } from 'react-router-dom';

const PRESET_IMAGES = [
  { label: 'Lehengas & Silks', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Shawls & Stoles', url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Footwear & Juttis', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80' },
  { label: 'Handloom Sarees', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Anarkali & Gowns', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' },
];

export const AdminCategoriesPage = () => {
  const { showToast } = useApp();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Lock background scroll when modal is open
  useScrollLock(isModalOpen);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    itemCount: 0,
  });

  const loadCategories = () => {
    setCategories(categoryService.getAllCategories());
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: PRESET_IMAGES[0].url,
      itemCount: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      itemCount: cat.itemCount || 0,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    if (!editingCategory) {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, name, slug: autoSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    if (editingCategory) {
      categoryService.updateCategory(editingCategory.id, formData);
      showToast(`Category "${formData.name}" updated successfully`, 'success');
    } else {
      categoryService.createCategory(formData);
      showToast(`Category "${formData.name}" created successfully`, 'success');
    }

    loadCategories();
    handleCloseModal();
  };

  const handleDelete = (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      categoryService.deleteCategory(cat.id);
      showToast(`Category "${cat.name}" deleted`, 'info');
      loadCategories();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 4px', color: 'var(--text-espresso)' }}>Boutique Categories</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Manage atelier product divisions, cover photography, and item counts ({categories.length} total categories)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> ADD NEW CATEGORY
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="cat-admin-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="admin-entity-card-hover"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ width: '100%', height: '170px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--surface-alt)' }}>
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(cat)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    color: 'var(--text-espresso)',
                    cursor: 'pointer',
                  }}
                  title="Edit Category"
                  aria-label="Edit Category"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                  }}
                  title="Delete Category"
                  aria-label="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>{cat.name}</h3>
                <span className="badge badge-sand">{cat.itemCount || 0} items</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                {cat.description || 'No description provided for this boutique category.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  target="_blank"
                  style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  View in Store <Eye size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Creation / Edit Modal */}
      {isModalOpen && createPortal(
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              padding: '28px 30px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 24px 60px rgba(74, 65, 60, 0.28)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  ATELIER MERCHANDISING
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '4px 0 0', color: 'var(--text-espresso)' }}>
                  {editingCategory ? 'Edit Boutique Category' : 'Add New Category'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  {editingCategory ? 'Update category specifications and photography' : 'Define a new product classification division for your atelier'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-modal-close"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">
                  CATEGORY NAME <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Royal Lehengas, Shawls, Footwear"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  URL SLUG <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. lehengas"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                  required
                />
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--surface-alt)', padding: '3px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    Storefront URL: <strong style={{ color: 'var(--primary)' }}>/shop?category={formData.slug || 'category-slug'}</strong>
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  DESCRIPTION
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Detailed description of craftsmanship, weaving story, and garment silhouettes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  COVER PHOTOGRAPHY URL
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: '46px',
                        height: '46px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-xs)',
                        border: '1.5px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>

                {/* Preset image suggestions for 1-click pick */}
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Quick Presets (Click to choose high-res atelier photography):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PRESET_IMAGES.map((preset) => {
                      const isSelected = formData.image === preset.url;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: preset.url })}
                          style={{
                            fontSize: '11px',
                            padding: '5px 12px',
                            borderRadius: 'var(--radius-full)',
                            border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface-alt)',
                            color: isSelected ? 'var(--primary)' : 'var(--text-espresso)',
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isSelected && '✓ '}
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ fontWeight: 600, padding: '10px 22px' }}
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @media (max-width: 900px) {
          .cat-admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
