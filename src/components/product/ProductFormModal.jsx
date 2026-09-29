import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Save, Eye, Check, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useApp } from '../../context/AppContext';
import { QuickViewModal } from './QuickViewModal';

export const ProductFormModal = ({ isOpen, onClose, initialProduct = null, onSuccess }) => {
  const isEditing = Boolean(initialProduct && initialProduct.id);
  const { showToast } = useApp();

  // 100% Freeze background wheel & touch scrolling while modal is open
  useScrollLock(isOpen);

  const [activeStep, setActiveStep] = useState(1);
  const [previewProduct, setPreviewProduct] = useState(null);

  const categories = categoryService.getAllCategories();
  const collections = collectionService.getAllCollections();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'sarees',
    collection: 'festive',
    description: '',
    price: 3499,
    salePrice: 2999,
    material: 'Pure Handloom Silk with Zari',
    care: 'Dry clean only. Store wrapped in muslin cloth.',
    tags: 'silk, festive, banarasi, handcrafted',
    images: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
    sizes: 'XS, S, M, L, XL',
    colors: 'Royal Crimson, Sand Amber',
    stock: 10,
    featured: false,
    newArrival: true,
    bestSeller: false,
    status: 'published',
    metaTitle: '',
    metaDescription: '',
    slug: '',
  });

  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
      if (initialProduct) {
        setFormData({
          name: initialProduct.name || '',
          sku: initialProduct.sku || '',
          category: initialProduct.category || 'sarees',
          collection: initialProduct.collection || 'festive',
          description: initialProduct.description || '',
          price: initialProduct.price || 0,
          salePrice: initialProduct.salePrice || initialProduct.price || 0,
          material: initialProduct.material || '',
          care: initialProduct.care || '',
          tags: Array.isArray(initialProduct.tags) ? initialProduct.tags.join(', ') : '',
          images: Array.isArray(initialProduct.images) ? initialProduct.images.join('\n') : initialProduct.images || '',
          sizes: Array.isArray(initialProduct.sizes) ? initialProduct.sizes.join(', ') : '',
          colors: Array.isArray(initialProduct.colors) ? initialProduct.colors.join(', ') : '',
          stock: initialProduct.stock || 0,
          featured: Boolean(initialProduct.featured),
          newArrival: Boolean(initialProduct.newArrival),
          bestSeller: Boolean(initialProduct.bestSeller),
          status: initialProduct.status || 'published',
          metaTitle: initialProduct.metaTitle || initialProduct.name || '',
          metaDescription: initialProduct.metaDescription || initialProduct.description || '',
          slug: initialProduct.slug || '',
        });
      } else {
        setFormData({
          name: '',
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          category: 'sarees',
          collection: 'festive',
          description: '',
          price: 3499,
          salePrice: 2999,
          material: 'Pure Handloom Silk with Zari',
          care: 'Dry clean only. Store wrapped in muslin cloth.',
          tags: 'silk, festive, banarasi, handcrafted',
          images: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
          sizes: 'XS, S, M, L, XL',
          colors: 'Royal Crimson, Sand Amber',
          stock: 10,
          featured: false,
          newArrival: true,
          bestSeller: false,
          status: 'published',
          metaTitle: '',
          metaDescription: '',
          slug: '',
        });
      }
    }
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  const handleNameChange = (nameVal) => {
    const slugVal = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: prev.slug ? prev.slug : slugVal,
      metaTitle: prev.metaTitle ? prev.metaTitle : `${nameVal} | Maison D'Or Atelier`,
    }));
  };

  const handleToggleSizeChip = (size) => {
    const currentSizes = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const updated = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setFormData({ ...formData, sizes: updated.join(', ') });
  };

  const handleToggleColorChip = (color) => {
    const currentColors = formData.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const updated = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    setFormData({ ...formData, colors: updated.join(', ') });
  };

  const handleAddPresetImage = (url) => {
    const currentList = formData.images
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    if (!currentList.includes(url)) {
      setFormData({
        ...formData,
        images: [...currentList, url].join('\n'),
      });
    }
  };

  const parseProductData = (overrideStatus) => {
    const imagesList = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    const sizesList = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const colorsList = formData.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    return {
      name: formData.name.trim(),
      sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      collection: formData.collection,
      description: formData.description.trim(),
      price: Number(formData.price) || 0,
      salePrice: Number(formData.salePrice) || Number(formData.price) || 0,
      material: formData.material.trim(),
      care: formData.care.trim(),
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80'],
      sizes: sizesList.length > 0 ? sizesList : ['Free Size'],
      colors: colorsList.length > 0 ? colorsList : ['Crimson Red'],
      stock: Math.max(0, parseInt(formData.stock, 10) || 0),
      featured: Boolean(formData.featured),
      newArrival: Boolean(formData.newArrival),
      bestSeller: Boolean(formData.bestSeller),
      status: overrideStatus || formData.status || 'published',
      metaTitle: formData.metaTitle || formData.name,
      metaDescription: formData.metaDescription || formData.description,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (!formData.name.trim()) {
        showToast('Please enter a Product Title to proceed', 'error');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!formData.price || formData.price <= 0) {
        showToast('Please enter a valid MRP price', 'error');
        return;
      }
      setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(1, prev - 1));
  };

  const handleSave = (statusToSave) => {
    if (!formData.name.trim()) {
      showToast('Product title is required', 'error');
      setActiveStep(1);
      return;
    }

    const payload = parseProductData(statusToSave);

    if (isEditing) {
      productService.updateProduct(initialProduct.id, payload);
      showToast('Atelier piece updated successfully!', 'success');
    } else {
      productService.createProduct(payload);
      showToast(
        statusToSave === 'draft'
          ? 'Product saved as draft.'
          : 'Product published to customer storefront successfully!',
        'success'
      );
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  const handlePreview = () => {
    if (!formData.name.trim()) {
      showToast('Please enter a product title first', 'error');
      return;
    }
    const mock = parseProductData(formData.status);
    setPreviewProduct({ ...mock, id: initialProduct?.id || 'preview-temp', rating: 5.0, reviewsCount: 0 });
  };

  const discountPercent =
    formData.price > formData.salePrice && formData.price > 0
      ? Math.round(((formData.price - formData.salePrice) / formData.price) * 100)
      : 0;

  const quickSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size (5.5M + 0.8M Blouse)', 'Adjustable Dori'];
  const quickColors = [
    { name: 'Royal Crimson', hex: '#8B1E2D' },
    { name: 'Sand Amber', hex: '#CCB499' },
    { name: 'Pistachio Mint', hex: '#A3B18A' },
    { name: 'Emerald Green', hex: '#1B4931' },
    { name: 'Terracotta Rust', hex: '#BB6C43' },
    { name: 'Ivory Gold', hex: '#EAE0D5' },
    { name: 'Mustard Yellow', hex: '#D4A373' },
  ];

  const presetPhotos = [
    { label: 'Katan Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Chanderi Kurti', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Linen Anarkali', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Kundan Choker', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Banarasi Georgette', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000&auto=format&fit=crop&q=80' },
  ];

  const currentSizesArray = formData.sizes.split(',').map((s) => s.trim());
  const currentColorsArray = formData.colors.split(',').map((c) => c.trim());

  return createPortal(
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '860px',
            width: '94%',
            maxHeight: '92vh',
            overflowY: 'auto',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 24px 60px rgba(74, 65, 60, 0.32)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
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
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 700 }}>
                ATELIER CREATION WIZARD
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '4px 0 0', color: 'var(--text-espresso)' }}>
                {isEditing ? `Edit: ${formData.name || 'Piece'}` : 'Add New Atelier Piece'}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Follow the 3-step structured atelier wizard to curate this garment
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handlePreview}
                className="btn btn-sand btn-sm"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                <Eye size={13} /> PREVIEW
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-modal-close"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid var(--border)',
              padding: '14px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {[
              { num: 1, title: 'Core Identity', subtitle: 'Name, Category & Story' },
              { num: 2, title: 'Pricing & Inventory', subtitle: 'MRP, Stock & Sizes' },
              { num: 3, title: 'Visuals & Badges', subtitle: 'Gallery & SEO' },
            ].map((step) => {
              const isActive = activeStep === step.num;
              const isCompleted = activeStep > step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => {
                    if (step.num < activeStep || (step.num === 2 && formData.name.trim())) {
                      setActiveStep(step.num);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    cursor: step.num <= activeStep ? 'pointer' : 'default',
                    opacity: activeStep >= step.num ? 1 : 0.45,
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      backgroundColor: isActive
                        ? 'var(--primary)'
                        : isCompleted
                        ? 'var(--surface-sand)'
                        : 'var(--surface-alt)',
                      color: isActive
                        ? '#FFFFFF'
                        : isCompleted
                        ? 'var(--primary)'
                        : 'var(--text-muted)',
                      border: isActive
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : `0${step.num}`}
                  </div>

                  <div>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        color: isActive ? 'var(--primary)' : 'var(--text-espresso)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {step.title}
                    </strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {step.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Form Body */}
          <div style={{ padding: '26px 30px', flex: 1 }}>
            {/* ================= STEP 1: CORE IDENTITY ================= */}
            {activeStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">
                    PRODUCT TITLE / PIECE NAME <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Kashi Crimson Pure Katan Silk Saree"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">ATELIER CATEGORY</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.name.toLowerCase()}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">COLLECTION CAPSULE</label>
                    <select
                      className="form-select"
                      value={formData.collection}
                      onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    >
                      <option value="">No Collection</option>
                      {collections.map((col) => (
                        <option key={col.id || col.slug} value={col.slug}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">SKU (STOCK KEEPING UNIT)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SAR-KAT-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">MATERIAL & FABRIC COMPOSITION</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="100% Pure Mulberry Katan Silk with Zari"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">DESCRIPTION & WEAVING ARTISAN STORY</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Describe weave heritage, zari authenticity, craftsmanship origin, drape, and silhouette..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CARE & PRESERVATION INSTRUCTIONS</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dry clean only. Store wrapped in pure muslin cloth."
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                  />
                </div>

                {/* Step 1 Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '18px', marginTop: '6px' }}>
                  <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Continue to Pricing & Stock <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: PRICING & INVENTORY ================= */}
            {activeStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      ORIGINAL MRP ₹ <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-control"
                      placeholder="3499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      BOUTIQUE SALE PRICE ₹ <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-control"
                      placeholder="2999"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    />
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div
                    style={{
                      backgroundColor: 'rgba(88, 17, 26, 0.06)',
                      border: '1px solid rgba(88, 17, 26, 0.22)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--primary)',
                      fontWeight: 600,
                    }}
                  >
                    <Sparkles size={14} />
                    Client savings active: {discountPercent}% OFF (Saves ₹{(formData.price - formData.salePrice).toLocaleString('en-IN')})
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    ATELIER INVENTORY STOCK (PIECES) <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">AVAILABLE SIZES</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="XS, S, M, L, XL, Free Size"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  />

                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Toggle standard sizes:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {quickSizes.map((size) => {
                        const isSelected = currentSizesArray.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleToggleSizeChip(size)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-xs)',
                              border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                              backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-sand)',
                              color: isSelected ? '#FFFFFF' : 'var(--text-espresso)',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 700 : 500,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">COLOR SHADES</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Royal Crimson, Sand Amber"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  />

                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Atelier Palette Presets:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {quickColors.map((color) => {
                        const isSelected = currentColorsArray.includes(color.name);
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => handleToggleColorChip(color.name)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-xs)',
                              border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                              backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-sand)',
                              color: isSelected ? '#FFFFFF' : 'var(--text-espresso)',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 700 : 500,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: color.hex,
                                border: '1px solid rgba(0,0,0,0.1)',
                              }}
                            />
                            {color.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '18px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={15} /> Back to Identity
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Continue to Visuals & Badges <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: VISUAL ASSETS & MERCHANDISING ================= */}
            {activeStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">PRODUCT PHOTOGRAPHY WEB ADDRESSES (1 PER LINE)</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  />

                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Add sample photography:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {presetPhotos.map((photo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddPresetImage(photo.url)}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--surface-sand)',
                            color: 'var(--text-espresso)',
                            cursor: 'pointer',
                          }}
                        >
                          + {photo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {formData.images
                      .split('\n')
                      .filter(Boolean)
                      .map((img, i) => (
                        <div
                          key={i}
                          style={{
                            width: '60px',
                            height: '78px',
                            borderRadius: 'var(--radius-xs)',
                            overflow: 'hidden',
                            border: '1px solid var(--border)',
                            position: 'relative',
                          }}
                        >
                          <img
                            src={img.trim()}
                            alt={`Preview ${i + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '8px' }}>
                    STOREFRONT MERCHANDISING BADGES
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { key: 'featured', title: 'Featured', desc: 'Boutique homepage showcase' },
                      { key: 'newArrival', title: 'New Arrival', desc: 'Latest creation' },
                      { key: 'bestSeller', title: 'Best Seller', desc: 'Client favorite' },
                    ].map((badge) => {
                      const isChecked = formData[badge.key];
                      return (
                        <div
                          key={badge.key}
                          onClick={() => setFormData({ ...formData, [badge.key]: !isChecked })}
                          style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            border: isChecked ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: isChecked ? 'rgba(88, 17, 26, 0.05)' : 'var(--surface-alt)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '12px', color: isChecked ? 'var(--primary)' : 'var(--text-espresso)' }}>
                              {badge.title}
                            </strong>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                            />
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {badge.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>
                    SEARCH & SEO DISCOVERABILITY
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">URL SLUG</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">META TITLE</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3 Final Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '18px',
                    marginTop: '6px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={15} /> Back to Pricing
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleSave('draft')}
                      className="btn btn-outline btn-sm"
                    >
                      SAVE DRAFT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave('published')}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={15} /> {isEditing ? 'UPDATE & PUBLISH' : 'PUBLISH PIECE'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewProduct && (
        <QuickViewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
      )}
    </>,
    document.body
  );
};
