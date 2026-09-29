import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tag, Copy, Check, Sparkles, Percent, Gift, ArrowRight, Clock, ShieldCheck, Truck, Search, X, RotateCcw } from 'lucide-react';
import { couponService } from '../../services/couponService';
import { productService } from '../../services/productService';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/product/ProductCard';
import { LiveSearchInput } from '../../components/common/LiveSearchInput';

export const OffersPage = () => {
  const { showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch active coupons
    const allCoupons = couponService.getAllCoupons();
    const active = allCoupons.filter((c) => c.status === 'active');
    setCoupons(active);
  }, []);

  // Filter vouchers by search query
  const filteredCoupons = useMemo(() => {
    if (!urlSearch || !urlSearch.trim()) return coupons;
    const q = urlSearch.toLowerCase().trim();
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        String(c.value).includes(q)
    );
  }, [coupons, urlSearch]);

  // Fetch all discounted products filtered by search query and category
  const discountedProducts = useMemo(() => {
    const all = productService.getAllProducts();
    let withDiscount = all.filter((p) => p.salePrice && p.salePrice < p.price);

    if (urlSearch && urlSearch.trim()) {
      const q = urlSearch.toLowerCase().trim();
      withDiscount = withDiscount.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.colors && p.colors.some((c) => c.toLowerCase().includes(q)))
      );
    }

    if (selectedCategory === 'all') return withDiscount;
    return withDiscount.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, urlSearch]);

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

  const categories = [
    { label: 'All Offers', value: 'all' },
    { label: 'Sarees', value: 'sarees' },
    { label: 'Kurtis & Sets', value: 'kurtis' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Jewellery', value: 'jewellery' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const handleCopyCoupon = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Voucher code "${code}" copied to clipboard! Apply at checkout.`, 'success');
    setTimeout(() => {
      setCopiedCode('');
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', paddingBottom: '90px' }}>
      {/* 1. Luxury Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--text-espresso) 0%, #2D2622 100%)',
          color: '#FFFFFF',
          padding: '54px 0 48px',
          borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--accent-sand)', marginBottom: '16px' }}>
            <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Atelier Offers & Privileges</span>
          </div>

          <div style={{ maxWidth: '720px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                marginBottom: '10px',
                fontWeight: 600,
                backgroundColor: 'rgba(197, 160, 89, 0.15)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <Sparkles size={13} /> Exclusive Atelier Privileges
            </span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', margin: '8px 0 12px', lineHeight: 1.15 }}>
              Seasonal Offers & Promo Codes
            </h1>
            <p style={{ color: 'var(--accent-sand)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px' }}>
              Explore verified voucher codes, complimentary gift privileges, and authentic handloom masterpieces on seasonal markdown.
            </p>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                <Tag size={16} color="var(--accent-sand)" />
                <span><strong>{coupons.length}</strong> Active Promo Codes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                <Percent size={16} color="var(--accent-sand)" />
                <span><strong>{discountedProducts.length}</strong> Pieces on Markdown</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF' }}>
                <Truck size={16} color="var(--accent-sand)" />
                <span>Complimentary Shipping &gt; ₹1,999</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '40px' }}>
        {/* In-Section Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '18px 24px',
            marginBottom: '36px',
            boxShadow: 'var(--shadow-sm)',
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
            scope="offers"
            scopeLabel="Offers & Vouchers"
            placeholder="Search offers, promo codes, or discounted pieces..."
            buttonText="SEARCH OFFERS"
          />

          {/* Active Search Filter Status */}
          {urlSearch && (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-espresso)' }}>
                  Active offers filter:
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

              <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                <Link to={`/new-arrivals?search=${encodeURIComponent(urlSearch)}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  Search New Arrivals
                </Link>
                <Link to={`/collections?search=${encodeURIComponent(urlSearch)}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  Search Collections
                </Link>
                <Link to={`/shop?search=${encodeURIComponent(urlSearch)}`} style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
                  Search All Store
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 2. Active Promo Codes / Vouchers Grid */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                Instant Savings at Checkout
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '4px 0 0', color: 'var(--text-espresso)' }}>
                Active Atelier Vouchers
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              {filteredCoupons.length} voucher{filteredCoupons.length === 1 ? '' : 's'} available
            </p>
          </div>

          {filteredCoupons.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredCoupons.map((coupon) => {
                const isCopied = copiedCode === coupon.code;
                return (
                  <div
                    key={coupon.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'var(--transition)',
                    }}
                    className="coupon-voucher-card"
                  >
                    {/* Decorative Perforated Top Bar */}
                    <div
                      style={{
                        backgroundColor: 'var(--surface-sand)',
                        padding: '16px 20px',
                        borderBottom: '1px dashed var(--accent-sand)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Gift size={16} color="var(--primary)" />
                        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--primary)', letterSpacing: '0.04em' }}>
                          {coupon.type === 'percentage'
                            ? `${coupon.value}% OFF`
                            : coupon.type === 'shipping'
                            ? 'FREE SHIPPING'
                            : `₹${coupon.value} FLAT OFF`}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          fontWeight: 600,
                        }}
                      >
                        MIN. ₹{coupon.minOrder.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '13px', color: 'var(--text-espresso)', lineHeight: 1.5, margin: '0 0 16px' }}>
                          {coupon.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-light)', marginBottom: '16px' }}>
                          <Clock size={13} />
                          <span>Valid through {new Date(coupon.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Voucher Code Box & Copy Action */}
                      <div
                        style={{
                          backgroundColor: 'var(--bg-base)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '6px 8px 6px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <code
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '14px',
                            letterSpacing: '0.08em',
                            color: 'var(--text-espresso)',
                          }}
                        >
                          {coupon.code}
                        </code>

                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className={`btn btn-xs ${isCopied ? 'btn-primary' : 'btn-sand'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 600,
                            padding: '6px 12px',
                          }}
                          title={`Copy ${coupon.code}`}
                          aria-label={`Copy voucher code ${coupon.code}`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={13} /> <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} /> <span>COPY CODE</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '32px 24px',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                No active voucher codes match "{urlSearch}". Check our seasonal markdown collection below.
              </p>
            </div>
          )}
        </section>

        {/* 3. Handcrafted Markdowns & Sale Collection */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                Heirloom Creations On Markdown
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '4px 0 0', color: 'var(--text-espresso)' }}>
                Special Seasonal Reductions
              </h2>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {discountedProducts.length} pieces on special offer
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '24px',
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
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 500,
                    backgroundColor: active ? 'var(--primary)' : '#FFFFFF',
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

          {/* Products Grid */}
          {discountedProducts.length > 0 ? (
            <div className="grid-4" style={{ gap: '24px' }}>
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid var(--border)',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              <Tag size={36} color="var(--accent-sand)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-espresso)', marginBottom: '8px' }}>
                {urlSearch ? `No marked-down pieces match "${urlSearch}"` : 'No active markdowns in this category'}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                {urlSearch
                  ? 'Pieces matching your search might not be on sale right now, but could be available in New Arrivals or our complete catalog.'
                  : 'Discover our complete collection or browse all available offers.'}
              </p>

              {urlSearch && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                  <Link to={`/new-arrivals?search=${encodeURIComponent(urlSearch)}`} className="btn btn-sand btn-sm">
                    Search in New Arrivals
                  </Link>
                  <Link to={`/collections?search=${encodeURIComponent(urlSearch)}`} className="btn btn-sand btn-sm">
                    Search in Collections
                  </Link>
                  <Link to={`/shop?search=${encodeURIComponent(urlSearch)}`} className="btn btn-primary btn-sm">
                    Search Entire Catalog
                  </Link>
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    handleClearSearch();
                  }}
                  className="btn btn-outline btn-sm"
                >
                  RESET FILTERS
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 4. Atelier Patron Benefits Trust Pillars */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '36px 32px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-sand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <Truck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-espresso)', margin: '0 0 4px', fontWeight: 600 }}>
                  Free Insured Shipping
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Complimentary express BlueDart air courier on all domestic orders above ₹1,999.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-sand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <Gift size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-espresso)', margin: '0 0 4px', fontWeight: 600 }}>
                  Artisanal Presentation
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Every piece arrives in keepsake muslin wraps with handwritten calligraphy notes.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-sand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-espresso)', margin: '0 0 4px', fontWeight: 600 }}>
                  7-Day Hassle-Free Exchange
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Shop with complete peace of mind. Easy exchanges across all boutique sizes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .coupon-voucher-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};
