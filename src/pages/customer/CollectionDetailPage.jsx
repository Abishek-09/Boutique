import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, RotateCcw } from 'lucide-react';
import { COLLECTIONS } from '../../data/collections';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { LiveSearchInput } from '../../components/common/LiveSearchInput';

export const CollectionDetailPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [collection, setCollection] = useState(null);
  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const col = COLLECTIONS.find((c) => c.slug === slug) || COLLECTIONS[0];
    setCollection(col);
  }, [slug]);

  // Filter products belonging to this collection and matching search query
  const products = useMemo(() => {
    if (!collection) return [];
    let items = productService.filterProducts({ collection: collection.slug });
    if (urlSearch && urlSearch.trim()) {
      const q = urlSearch.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [collection, urlSearch]);

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

  if (!collection) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', padding: '40px 0 80px', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <Link to="/collections" style={{ textDecoration: 'underline' }}>Collections</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{collection.name}</span>
        </div>

        {/* Collection Hero */}
        <div
          style={{
            position: 'relative',
            minHeight: '280px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to right, rgba(28, 25, 23, 0.92) 0%, rgba(88, 17, 26, 0.65) 50%, rgba(28, 25, 23, 0.35) 100%), url(${collection.banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', color: '#FFFFFF' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Curated Capsule Atelier
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 44px)', color: '#FFFFFF', margin: '8px 0 14px', lineHeight: 1.15, fontWeight: 600 }}>
              {collection.name}
            </h1>
            <p style={{ color: 'var(--bg-base)', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
              {collection.subtitle}
            </p>
          </div>
        </div>

        {/* In-Collection Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '16px 20px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 320px', maxWidth: '540px' }}>
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
                scope="collections"
                scopeLabel={collection.name}
                collectionSlug={collection.slug}
                placeholder={`Search within ${collection.name}...`}
              />
            </div>

            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {products.length} capsule pieces
            </span>
          </div>

          {urlSearch && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-espresso)' }}>
                Filtering {collection.name} by: <strong>"{urlSearch}"</strong>
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn btn-ghost btn-xs"
                style={{ color: 'var(--primary)', fontWeight: 600 }}
              >
                Clear Search & Show All
              </button>
            </div>
          )}
        </div>

        {/* Products Grid or Empty State */}
        {products.length > 0 ? (
          <div className="grid-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '48px 24px',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            <Search size={32} color="var(--accent-gold)" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-espresso)', margin: '0 0 8px' }}>
              No pieces in {collection.name} match "{urlSearch}"
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
              This item might be part of another capsule collection or available in our general catalog.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleClearSearch} className="btn btn-primary btn-sm">
                <RotateCcw size={14} /> Clear Search & View All in {collection.name}
              </button>
              <Link to={`/shop?search=${encodeURIComponent(urlSearch)}`} className="btn btn-sand btn-sm">
                Search in All Collections & Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
