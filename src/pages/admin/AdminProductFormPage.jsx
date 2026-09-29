import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Eye, Check, Image as ImageIcon, Sparkles, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import { useApp } from '../../context/AppContext';
import { QuickViewModal } from '../../components/product/QuickViewModal';

export const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useApp();

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
    window.scrollTo(0, 0);
    if (isEditing) {
      const existing = productService.getProductById(id);
      if (existing) {
        setFormData({
          name: existing.name || '',
          sku: existing.sku || '',
          category: existing.category || 'sarees',
          collection: existing.collection || 'festive',
          description: existing.description || '',
          price: existing.price || 0,
          salePrice: existing.salePrice || existing.price || 0,
          material: existing.material || '',
          care: existing.care || '',
          tags: Array.isArray(existing.tags) ? existing.tags.join(', ') : '',
          images: Array.isArray(existing.images) ? existing.images.join('\n') : existing.images || '',
          sizes: Array.isArray(existing.sizes) ? existing.sizes.join(', ') : '',
          colors: Array.isArray(existing.colors) ? existing.colors.join(', ') : '',
          stock: existing.stock || 0,
          featured: Boolean(existing.featured),
          newArrival: Boolean(existing.newArrival),
          bestSeller: Boolean(existing.bestSeller),
          status: existing.status || 'published',
          metaTitle: existing.metaTitle || existing.name || '',
          metaDescription: existing.metaDescription || existing.description || '',
          slug: existing.slug || '',
        });
      }
    }
  }, [id, isEditing]);

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
        showToast('Please enter a Product Name to continue', 'error');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!formData.price || formData.price <= 0) {
        showToast('Please enter a valid Original Price (MRP)', 'error');
        return;
      }
      setActiveStep(3);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = (statusToSave) => {
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      setActiveStep(1);
      return;
    }

    const payload = parseProductData(statusToSave);

    if (isEditing) {
      productService.updateProduct(id, payload);
      showToast('Product updated successfully in atelier catalog.', 'success');
    } else {
      productService.createProduct(payload);
      showToast(
        statusToSave === 'draft'
          ? 'Product saved as draft.'
          : 'Product published to boutique storefront successfully!',
        'success'
      );
    }

    navigate('/admin/products');
  };

  const handlePreview = () => {
    if (!formData.name.trim()) {
      showToast('Please enter a product name first', 'error');
      return;
    }
    const mock = parseProductData(formData.status);
    setPreviewProduct({ ...mock, id: id || 'preview-temp', rating: 5.0, reviewsCount: 0 });
  };

  // Discount calculation
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

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/admin/products" className="btn btn-sand btn-sm">
            <ArrowLeft size={15} /> Back
          </Link>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              {isEditing ? `Edit: ${formData.name || 'Product'}` : 'Add New Atelier Piece'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Follow the 3-step structured atelier wizard to curate this garment
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handlePreview} className="btn btn-sand btn-sm">
            <Eye size={14} /> PREVIEW
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
        }}
      >
        {[
          { num: 1, title: 'Core Identity', subtitle: 'Name, Category & Story' },
          { num: 2, title: 'Pricing & Inventory', subtitle: 'MRP, Stock & Sizes' },
          { num: 3, title: 'Visuals & Badges', subtitle: 'Gallery & SEO' },
        ].map((step, idx) => {
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
                gap: '12px',
                flex: 1,
                cursor: step.num <= activeStep ? 'pointer' : 'default',
                opacity: activeStep >= step.num ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                  backgroundColor: isActive
                    ? 'var(--primary)'
                    : isCompleted
                    ? 'var(--surface-alt)'
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
                {isCompleted ? <CheckCircle2 size={18} /> : `0${step.num}`}
              </div>

              <div>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    color: isActive ? 'var(--primary)' : 'var(--text-espresso)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {step.title}
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Wizard Form Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '32px 36px',
          boxShadow: '0 2px 10px rgba(74, 65, 60, 0.03)',
        }}
      >
        {/* ================= STEP 1: CORE IDENTITY ================= */}
        {activeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>
                Step 1: Piece Identity & Artisan Story
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Specify garment naming, category attribution, and artisanal weaving origin
              </p>
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="form-2col">
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="form-2col">
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
                rows={4}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
              <Link to="/admin/products" className="btn btn-outline btn-sm">
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Continue to Pricing & Inventory <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PRICING & INVENTORY ================= */}
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>
                Step 2: Pricing, Stock & Variant Specifications
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Set INR prices, active inventory quantities, size measurements, and color palettes
              </p>
            </div>

            {/* Pricing Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="form-2col">
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

            {/* Discount Summary Pill */}
            {discountPercent > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(88, 17, 26, 0.06)',
                  border: '1px solid rgba(88, 17, 26, 0.22)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={15} />
                Client savings active: {discountPercent}% OFF (Client saves ₹
                {(formData.price - formData.salePrice).toLocaleString('en-IN')})
              </div>
            )}

            {/* Stock Count */}
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

            {/* Sizes with Quick Chips */}
            <div className="form-group">
              <label className="form-label">AVAILABLE SIZES</label>
              <input
                type="text"
                className="form-control"
                placeholder="XS, S, M, L, XL, Free Size"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              />

              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Quick Size Chips (click to toggle):
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
                          backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-alt)',
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

            {/* Color Shades with Quick Chips */}
            <div className="form-group">
              <label className="form-label">COLOR SHADES</label>
              <input
                type="text"
                className="form-control"
                placeholder="Royal Crimson, Sand Amber"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              />

              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Atelier Palette Presets (click to toggle):
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
                          backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-alt)',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>
                Step 3: Visual Imagery, Badges & Discoverability
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Add high-resolution photography, configure storefront badges, and finalize search SEO
              </p>
            </div>

            {/* Photography Input */}
            <div className="form-group">
              <label className="form-label">PRODUCT PHOTOGRAPHY WEB ADDRESSES (1 PER LINE)</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              />

              {/* Preset Gallery Picker */}
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Click to add curated sample photography:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {presetPhotos.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddPresetImage(photo.url)}
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface-alt)',
                        color: 'var(--text-espresso)',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      + {photo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview Thumbnails */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                {formData.images
                  .split('\n')
                  .filter(Boolean)
                  .map((img, i) => (
                    <div
                      key={i}
                      style={{
                        width: '70px',
                        height: '92px',
                        borderRadius: 'var(--radius-xs)',
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        position: 'relative',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
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

            {/* Merchandising Badges Cards */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '10px' }}>
                STOREFRONT MERCHANDISING BADGES
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="badges-grid">
                {[
                  {
                    key: 'featured',
                    title: 'Featured Piece',
                    desc: 'Highlight on boutique homepage showcase',
                  },
                  {
                    key: 'newArrival',
                    title: 'New Arrival',
                    desc: 'Badge as latest atelier creation',
                  },
                  {
                    key: 'bestSeller',
                    title: 'Best Seller',
                    desc: 'Mark as highly coveted client favorite',
                  },
                ].map((badge) => {
                  const isChecked = formData[badge.key];
                  return (
                    <div
                      key={badge.key}
                      onClick={() => setFormData({ ...formData, [badge.key]: !isChecked })}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isChecked ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: isChecked ? 'rgba(88, 17, 26, 0.05)' : 'var(--surface-alt)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px', color: isChecked ? 'var(--primary)' : 'var(--text-espresso)' }}>
                          {badge.title}
                        </strong>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {badge.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search & SEO Details */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
              <label className="form-label" style={{ marginBottom: '12px' }}>
                SEARCH & SEO DISCOVERABILITY
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="form-2col">
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
                paddingTop: '20px',
                marginTop: '10px',
                flexWrap: 'wrap',
                gap: '12px',
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
                  SAVE AS DRAFT
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

      {/* Quick View Preview Modal */}
      {previewProduct && (
        <QuickViewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .form-2col {
            grid-template-columns: 1fr !important;
          }
          .badges-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
