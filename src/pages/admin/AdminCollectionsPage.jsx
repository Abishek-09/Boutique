import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, Plus, Edit3, Package, Check, X, Search, Image as ImageIcon } from 'lucide-react';
import { collectionService } from '../../services/collectionService';
import { productService } from '../../services/productService';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useApp } from '../../context/AppContext';

export const AdminCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    banner: '',
  });

  const { showToast } = useApp();

  // Freeze background wheel & touch scrolling while modal is open
  useScrollLock(isModalOpen);

  const loadData = () => {
    setCollections(collectionService.getAllCollections());
    setAllProducts(productService.getAllProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      subtitle: '',
      banner: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop&q=80',
    });
    setSelectedProductIds([]);
    setProductSearch('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (col) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      subtitle: col.subtitle || '',
      banner: col.banner || '',
    });
    // Find all products currently assigned to this collection
    const currentAssigned = allProducts
      .filter((p) => p.collection === col.slug)
      .map((p) => p.id);
    setSelectedProductIds(currentAssigned);
    setProductSearch('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleToggleProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAllFiltered = (filteredIds) => {
    setSelectedProductIds((prev) => {
      const merged = new Set([...prev, ...filteredIds]);
      return Array.from(merged);
    });
  };

  const handleClearAll = () => {
    setSelectedProductIds([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Collection name is required', 'error');
      return;
    }

    if (editingCollection) {
      collectionService.updateCollection(
        editingCollection.id,
        {
          name: formData.name.trim(),
          subtitle: formData.subtitle.trim(),
          banner: formData.banner.trim(),
        },
        selectedProductIds
      );
      showToast(`Updated "${formData.name}" and synced ${selectedProductIds.length} pieces`, 'success');
    } else {
      collectionService.createCollection({
        name: formData.name.trim(),
        subtitle: formData.subtitle.trim(),
        banner: formData.banner.trim(),
        productIds: selectedProductIds,
      });
      showToast(`Created collection "${formData.name}" with ${selectedProductIds.length} pieces`, 'success');
    }

    loadData();
    handleCloseModal();
  };

  const filteredProducts = allProducts.filter((p) => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  const presetBanners = [
    { label: 'Royal Banarasi', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Pastel Organza', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Festive Zari', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Minimalist Studio', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
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
          <h1 style={{ fontSize: '24px', margin: '0 0 4px' }}>Themed Collections & Capsules</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Curate seasonal capsules, royal silk editions, and atelier campaigns
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Add New Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="col-admin-grid">
        {collections.map((col) => (
          <div
            key={col.id}
            className="admin-entity-card-hover"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(74, 65, 60, 0.04)',
            }}
          >
            <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
              <img src={col.banner} alt={col.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-espresso)',
                }}
              >
                {col.itemCount || 0} Pieces Assigned
              </div>
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '20px', margin: 0 }}>{col.name}</h3>
                <span className="badge badge-sand">{col.itemCount || 0} items</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px', flex: 1, lineHeight: 1.5 }}>
                {col.subtitle || 'Atelier seasonal curation and signature silhouettes.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <Link
                  to={`/collections/${col.slug}`}
                  target="_blank"
                  style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  View Live Capsule <Eye size={13} />
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(col)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={13} /> Manage Products ({col.itemCount || 0})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collection Creation / Edit & Product Assignment Modal */}
      {isModalOpen && createPortal(
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '780px',
              width: '92%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 24px 60px rgba(74, 65, 60, 0.28)',
              padding: 0,
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 30px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--surface-alt)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>
                  {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create New Themed Collection'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Define collection story and select products to showcase in this capsule
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-modal-close"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">COLLECTION NAME *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Royal Banarasi Kadwa Silk"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EDITORIAL SUBTITLE & STORY</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Artisanal silhouettes woven with heritage gold zari and royal motifs..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EDITORIAL BANNER IMAGE URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                />

                {/* Banner Presets */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>
                    Luxury Presets:
                  </span>
                  {presetBanners.map((pre, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, banner: pre.url })}
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border)',
                        backgroundColor: formData.banner === pre.url ? 'var(--primary)' : 'var(--surface-alt)',
                        color: formData.banner === pre.url ? '#FFFFFF' : 'var(--text-espresso)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {pre.label}
                    </button>
                  ))}
                </div>

                {/* Banner Live Preview */}
                {formData.banner && (
                  <div style={{ marginTop: '12px', height: '100px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={formData.banner} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Product Assignment Section */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <label className="form-label" style={{ marginBottom: '2px' }}>
                      ASSIGN PRODUCTS TO THIS CAPSULE ({selectedProductIds.length} SELECTED)
                    </label>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      Toggle pieces to include or exclude from this collection
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectAllFiltered(filteredProducts.map((p) => p.id))}
                      className="btn btn-sand btn-sm"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      Select All Filtered
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                {/* Product Search Filter */}
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filter products by title, SKU, or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{ paddingRight: '36px', fontSize: '12px' }}
                  />
                  <Search size={14} style={{ position: 'absolute', right: '12px', top: '11px', color: 'var(--text-light)' }} />
                </div>

                {/* Scrollable Products List */}
                <div
                  style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {filteredProducts.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No atelier pieces found matching "{productSearch}"
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {filteredProducts.map((prod) => {
                        const isSelected = selectedProductIds.includes(prod.id);
                        const isCurrentlyInOtherCol =
                          prod.collection &&
                          editingCollection &&
                          prod.collection !== editingCollection.slug;

                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleToggleProduct(prod.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderBottom: '1px solid var(--border)',
                              backgroundColor: isSelected ? 'rgba(197, 160, 89, 0.08)' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // handled by row click
                                style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '16px', height: '16px' }}
                              />
                              <img
                                src={prod.images?.[0]}
                                alt={prod.name}
                                style={{ width: '36px', height: '46px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                              />
                              <div>
                                <strong style={{ fontSize: '13px', color: 'var(--text-espresso)', display: 'block' }}>
                                  {prod.name}
                                </strong>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {prod.category} • SKU: {prod.sku} • ₹{prod.price?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            <div>
                              {isSelected ? (
                                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                                  Assigned
                                </span>
                              ) : isCurrentlyInOtherCol ? (
                                <span className="badge badge-sand" style={{ fontSize: '10px' }}>
                                  In: {prod.collection}
                                </span>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                                  Unassigned
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '18px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check size={14} /> {editingCollection ? 'Save Changes & Sync Products' : 'Create Collection & Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @media (max-width: 768px) {
          .col-admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
