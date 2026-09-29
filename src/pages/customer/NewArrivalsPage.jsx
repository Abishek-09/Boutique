import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Search, X, ArrowRight, Layers, Tag, ShoppingBag, RotateCcw } from 'lucide-react';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { LiveSearchInput } from '../../components/common/LiveSearchInput';

export const NewArrivalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newArrivals, setNewArrivals] = useState([]);

  // Sync state if URL query changes
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch new arrivals matching search query
  useEffect(() => {
    const list = productService.getNewArrivals(urlSearch);
    setNewArrivals(list);
  }, [urlSearch]);

  // Cross-section counts for intelligent recommendation
  const crossSectionCounts = useMemo(() => {
    return productService.getSearchCountsBySection(urlSearch);
  }, [urlSearch]);

  // Further category filtering
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return newArrivals;
    return newArrivals.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [newArrivals, selectedCategory]);

  const categories = [
    { label: 'All New Pieces', value: 'all' },
    { label: 'Sarees', value: 'sarees' },
    { label: 'Kurtis & Sets', value: 'kurtis' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Jewellery', value: 'jewellery' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', padding: '40px 0 80px', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>New Season Arrivals</span>
          {urlSearch && (
            <>
              <span>/</span>
              <span style={{ color: 'var(--text-espresso)' }}>Search: "{urlSearch}"</span>
            </>
          )}
        </div>

        {/* Hero Banner */}
        <div
          style={{
            backgroundColor: 'var(--text-espresso)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '48px 40px',
            marginBottom: '36px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--accent-sand)',
                marginBottom: '12px',
                fontWeight: 600,
              }}
            >
              <Sparkles size={14} /> Fresh Off The Artisanal Looms
            </span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.15 }}>
              New Season Arrivals
            </h1>
            <p style={{ color: 'var(--accent-sand)', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
              Discover our latest hand-embellished sarees, fresh pastel dresses, and heritage brass jewelry fresh from our studio.
            </p>
          </div>
        </div>

        {/* In-Section Search Bar & Quick Filters */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '20px 24px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* On-Page Search Input Form */}
            <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
              <LiveSearchInput
                value={searchInput}
                onChange={(val) => setSearchInput(val)}
                onSubmit={(query) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (query.trim()) {
                    newParams.set('search', query.trim());
                  } else {
                    newParams.delete('search');
                  }
                  setSearchParams(newParams);
                }}
                scope="new-arrivals"
                scopeLabel="New Arrivals"
                placeholder="Filter new arrivals (e.g. Silk, Saree, Kurti)..."
              />
            </div>

            {/* Category Filter Chips */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: active ? 600 : 500,
                      backgroundColor: active ? 'var(--primary)' : 'var(--surface-sand)',
                      color: active ? '#FFFFFF' : 'var(--text-espresso)',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Search & Cross-Section Discovery Banner */}
          {urlSearch && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-espresso)', fontWeight: 500 }}>
                  Showing <strong>{filteredProducts.length}</strong> new arrival{filteredProducts.length === 1 ? '' : 's'} matching:
                </span>
                <span
                  style={{
                    backgroundColor: 'var(--surface-sand)',
                    border: '1px solid var(--border)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  "{urlSearch}"
                  <button
                    onClick={handleClearSearch}
                    style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                    title="Remove filter"
                    aria-label="Remove filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>

              {/* Cross-section discovery hint when matches exist elsewhere */}
              {(crossSectionCounts.collections > 0 || crossSectionCounts.offers > 0) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Also found in:</span>
                  {crossSectionCounts.collections > 0 && (
                    <Link
                      to={`/collections?search=${encodeURIComponent(urlSearch)}`}
                      style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      Collections ({crossSectionCounts.collections})
                    </Link>
                  )}
                  {crossSectionCounts.offers > 0 && (
                    <Link
                      to={`/offers?search=${encodeURIComponent(urlSearch)}`}
                      style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      Offers ({crossSectionCounts.offers})
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Grid or Rich Empty State with Cross-Section Discovery */}
        {filteredProducts.length > 0 ? (
          <div className="grid-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--accent-gold)',
              }}
            >
              <Search size={26} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--text-espresso)', margin: '0 0 8px' }}>
              No new arrivals match "{urlSearch || selectedCategory}"
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
              We couldn't find any newly arrived pieces with this specific search in New Arrivals.
              {crossSectionCounts.allShop > 0 && ' However, matching pieces are available across other boutique sections!'}
            </p>

            {/* Cross-Section Action Buttons */}
            {crossSectionCounts.allShop > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
                {crossSectionCounts.collections > 0 && (
                  <Link
                    to={`/collections?search=${encodeURIComponent(urlSearch)}`}
                    className="btn btn-sand btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Layers size={14} /> View in Collections ({crossSectionCounts.collections} pieces)
                  </Link>
                )}

                {crossSectionCounts.offers > 0 && (
                  <Link
                    to={`/offers?search=${encodeURIComponent(urlSearch)}`}
                    className="btn btn-sand btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Tag size={14} /> View in Offers ({crossSectionCounts.offers} pieces)
                  </Link>
                )}

                <Link
                  to={`/shop?search=${encodeURIComponent(urlSearch)}`}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShoppingBag size={14} /> Search Entire Catalog ({crossSectionCounts.allShop} pieces)
                </Link>
              </div>
            ) : null}

            <div>
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} /> Clear Search & View All New Arrivals
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
