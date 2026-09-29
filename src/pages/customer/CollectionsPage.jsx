import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, X, Sparkles, Layers, Tag, ShoppingBag, RotateCcw } from 'lucide-react';
import { COLLECTIONS } from '../../data/collections';
import { productService } from '../../services/productService';
import { LiveSearchInput } from '../../components/common/LiveSearchInput';

export const CollectionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const crossSectionCounts = useMemo(() => {
    return productService.getSearchCountsBySection(urlSearch);
  }, [urlSearch]);

  const filteredCollections = useMemo(() => {
    if (!urlSearch || !urlSearch.trim()) return COLLECTIONS;
    const q = urlSearch.toLowerCase().trim();

    // Check if collection name, subtitle, or contained products match
    return COLLECTIONS.filter((col) => {
      const nameMatch = col.name.toLowerCase().includes(q) || col.subtitle.toLowerCase().includes(q);
      if (nameMatch) return true;

      // Check if any product in this collection matches
      const colProducts = productService.filterProducts({ collection: col.slug });
      return colProducts.some(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    });
  }, [urlSearch]);

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
    <div style={{ backgroundColor: 'var(--bg-base)', padding: '50px 0 90px', minHeight: '85vh' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
            Curated Editions
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', letterSpacing: '0.04em', margin: '6px 0 12px' }}>Boutique Collections</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Each collection is an intimate capsule study of specific regional weaves, heritage textures, and silhouettes.
          </p>
        </div>

        {/* In-Section Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '18px 24px',
            marginBottom: '36px',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '680px',
            margin: '0 auto 36px',
          }}
        >
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
            scopeLabel="Collections"
            placeholder="Search collections (e.g. Banarasi, Pastel, Silk)..."
          />

          {urlSearch && (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-espresso)' }}>
                  Showing collections matching:
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
                  <button onClick={handleClearSearch} style={{ color: 'var(--text-muted)' }} title="Clear filter">
                    <X size={12} />
                  </button>
                </span>
              </div>

              {(crossSectionCounts.newArrivals > 0 || crossSectionCounts.offers > 0) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Also in:</span>
                  {crossSectionCounts.newArrivals > 0 && (
                    <Link to={`/new-arrivals?search=${encodeURIComponent(urlSearch)}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                      New Arrivals ({crossSectionCounts.newArrivals})
                    </Link>
                  )}
                  {crossSectionCounts.offers > 0 && (
                    <Link to={`/offers?search=${encodeURIComponent(urlSearch)}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                      Offers ({crossSectionCounts.offers})
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collections Grid or Empty State */}
        {filteredCollections.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }} className="collections-grid">
            {filteredCollections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}${urlSearch ? `?search=${encodeURIComponent(urlSearch)}` : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  transition: 'var(--transition)',
                }}
                className="collection-card"
              >
                <div style={{ width: '100%', height: '320px', overflow: 'hidden' }}>
                  <img
                    src={col.banner}
                    alt={col.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                </div>

                <div style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
                  <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    Capsule Atelier
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: '6px 0 8px', color: 'var(--text-espresso)' }}>
                    {col.name}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    {col.subtitle}
                  </p>
                  <div className="explore-pieces-btn">
                    <span>EXPLORE {col.itemCount} PIECES</span>
                    <ArrowRight size={14} className="explore-arrow" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '56px 24px',
              textAlign: 'center',
              maxWidth: '680px',
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
              No collections found matching "{urlSearch}"
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
              We couldn't find a collection matching your search term. You can discover matching pieces in other boutique sections:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
              {crossSectionCounts.newArrivals > 0 && (
                <Link
                  to={`/new-arrivals?search=${encodeURIComponent(urlSearch)}`}
                  className="btn btn-sand btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} /> Check New Arrivals ({crossSectionCounts.newArrivals} pieces)
                </Link>
              )}

              {crossSectionCounts.offers > 0 && (
                <Link
                  to={`/offers?search=${encodeURIComponent(urlSearch)}`}
                  className="btn btn-sand btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Tag size={14} /> Check Offers ({crossSectionCounts.offers} pieces)
                </Link>
              )}

              <Link
                to={`/shop?search=${encodeURIComponent(urlSearch)}`}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ShoppingBag size={14} /> Search All Products ({crossSectionCounts.allShop} pieces)
              </Link>
            </div>

            <div>
              <button type="button" onClick={handleClearSearch} className="btn btn-outline btn-sm">
                <RotateCcw size={14} /> Clear Search & View All Collections
              </button>
            </div>
          </div>
        )}

        <style>{`
          .explore-pieces-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--primary);
            font-weight: 700;
            font-size: 12px;
            letter-spacing: 0.08em;
            padding: 8px 18px;
            border-radius: var(--radius-full);
            background-color: var(--surface-alt);
            border: 1px solid var(--border);
            transition: var(--transition-smooth);
            box-shadow: 0 2px 6px rgba(197, 160, 89, 0.12);
            position: relative;
            z-index: 2;
            cursor: pointer;
          }
          .explore-arrow {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          /* Card Field Hover: Lifts card, enhances shadow, zooms image */
          .collection-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 16px 36px rgba(28, 25, 23, 0.09);
            border-color: var(--accent-gold);
          }
          .collection-card:hover img {
            transform: scale(1.04);
          }
          /* Explore Button Hover: ONLY activates when mouse is directly over the button */
          .explore-pieces-btn:hover {
            background-color: var(--primary);
            color: #FFFFFF;
            border-color: var(--primary);
            box-shadow: 0 6px 18px rgba(88, 17, 26, 0.28);
            transform: translateX(4px) scale(1.03);
          }
          .explore-pieces-btn:hover .explore-arrow {
            transform: translateX(5px) scale(1.15);
          }
          @media (max-width: 768px) {
            .collections-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
