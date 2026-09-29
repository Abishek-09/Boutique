import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard';
import { categoryService } from '../../services/categoryService';
import { COLLECTIONS } from '../../data/collections';
import { productService } from '../../services/productService';
import { LiveSearchInput } from '../../components/common/LiveSearchInput';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read URL params
  const categoryParam = searchParams.get('category') || 'all';
  const collectionParam = searchParams.get('collection') || 'all';
  const searchParam = searchParams.get('search') || '';
  const discountParam = searchParams.get('discount') === 'true';
  const sortParam = searchParams.get('sort') || 'featured';

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState(collectionParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(discountParam);

  // Sync state if URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedCollection(searchParams.get('collection') || 'all');
    setSearchQuery(searchParams.get('search') || '');
    setDiscountOnly(searchParams.get('discount') === 'true');
    setSortBy(searchParams.get('sort') || 'featured');
  }, [searchParams]);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];
  const allColors = ['Crimson', 'Sage', 'Terracotta', 'Gold', 'Emerald', 'Rose', 'Mustard', 'Indigo', 'Ivory'];

  // Query products through productService
  const filteredProducts = useMemo(() => {
    let list = productService.filterProducts({
      category: selectedCategory,
      collection: selectedCollection,
      minPrice: 0,
      maxPrice: priceRange,
      size: selectedSize,
      color: selectedColor,
      inStockOnly,
      sortBy,
      searchQuery,
    });

    if (discountOnly) {
      list = list.filter((p) => p.salePrice && p.salePrice < p.price);
    }

    return list;
  }, [selectedCategory, selectedCollection, priceRange, selectedSize, selectedColor, inStockOnly, discountOnly, sortBy, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSearchQuery('');
    setPriceRange(5000);
    setSelectedSize('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setDiscountOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const handleCategoryClick = (catSlug) => {
    setSelectedCategory(catSlug);
    const newParams = new URLSearchParams(searchParams);
    if (catSlug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catSlug);
    }
    setSearchParams(newParams);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '80vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
            <span>/</span>
            <Link to="/shop" style={{ textDecoration: 'underline' }}>Boutique Catalog</Link>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: 600 }}>
                  {selectedCategory}
                </span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span style={{ color: 'var(--text-espresso)', fontWeight: 600 }}>
                  Search: "{searchQuery}"
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', letterSpacing: '0.04em', margin: 0, color: 'var(--text-espresso)' }}>
                {searchQuery
                  ? `SEARCH: "${searchQuery.toUpperCase()}"`
                  : selectedCategory !== 'all'
                  ? `${selectedCategory.toUpperCase()} COLLECTION`
                  : 'ALL BOUTIQUE ATELIERS'}
              </h1>
              <p style={{ fontSize: '14px', margin: '6px 0 0' }}>
                Showing {filteredProducts.length} handcrafted heirloom pieces
                {searchQuery && ` matching "${searchQuery}"`}
              </p>

              {/* Cross-section quick jump pills when searching */}
              {searchQuery && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Search in specific sections:</span>
                  <Link
                    to={`/new-arrivals?search=${encodeURIComponent(searchQuery)}`}
                    className="btn btn-ghost btn-xs"
                    style={{ border: '1px solid var(--border)', backgroundColor: '#FFFFFF', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}
                  >
                    ✦ In New Arrivals
                  </Link>
                  <Link
                    to={`/collections?search=${encodeURIComponent(searchQuery)}`}
                    className="btn btn-ghost btn-xs"
                    style={{ border: '1px solid var(--border)', backgroundColor: '#FFFFFF', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}
                  >
                    ✦ In Collections
                  </Link>
                  <Link
                    to={`/offers?search=${encodeURIComponent(searchQuery)}`}
                    className="btn btn-ghost btn-xs"
                    style={{ border: '1px solid var(--border)', backgroundColor: '#FFFFFF', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}
                  >
                    ✦ In Offers
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn btn-sand btn-sm mobile-filter-btn"
              style={{ display: 'none' }}
            >
              <Filter size={16} /> FILTERS & REFINE
            </button>
          </div>
        </div>

        {/* Catalog Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="shop-sidebar">
            <div className="shop-sidebar-sticky">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Filter By
                </span>
                <button
                  onClick={handleResetFilters}
                  style={{ fontSize: '12px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Search input in sidebar with live autocomplete */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>SEARCH ATELIER</label>
                <LiveSearchInput
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                  onSubmit={(query) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (query.trim()) {
                      newParams.set('search', query.trim());
                    } else {
                      newParams.delete('search');
                    }
                    setSearchParams(newParams);
                  }}
                  scope="shop"
                  scopeLabel="Entire Store"
                  placeholder="Search name, fabric, SKU..."
                  showSubmitButton={false}
                />
              </div>

              {/* Category Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '10px' }}>CATEGORIES</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontSize: '13px',
                      color: selectedCategory === 'all' ? 'var(--primary)' : 'var(--text-espresso)',
                      fontWeight: selectedCategory === 'all' ? 700 : 400,
                    }}
                  >
                    <span>All Categories</span>
                  </button>
                  {categoryService.getAllCategories().map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: selectedCategory === cat.slug ? 'var(--primary)' : 'var(--text-espresso)',
                        fontWeight: selectedCategory === cat.slug ? 700 : 400,
                      }}
                    >
                      <span>{cat.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({cat.itemCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collection Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '10px' }}>COLLECTIONS</label>
                <select
                  className="form-select"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  <option value="all">All Collections</option>
                  {COLLECTIONS.map((col) => (
                    <option key={col.id} value={col.slug}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontSize: '12px', margin: 0 }}>MAX PRICE</label>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                    ₹{priceRange.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>₹1,000</span>
                  <span>₹5,000</span>
                </div>
              </div>

              {/* Size Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>SIZE</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedSize('all')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-xs)',
                      border: selectedSize === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedSize === 'all' ? 'var(--primary-light)' : '#FFFFFF',
                      color: selectedSize === 'all' ? 'var(--primary)' : 'var(--text-espresso)',
                      fontWeight: selectedSize === 'all' ? 600 : 400,
                    }}
                  >
                    All
                  </button>
                  {allSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-xs)',
                        border: selectedSize === sz ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedSize === sz ? 'var(--primary-light)' : '#FFFFFF',
                        color: selectedSize === sz ? 'var(--primary)' : 'var(--text-espresso)',
                        fontWeight: selectedSize === sz ? 600 : 400,
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '12px', marginBottom: '8px' }}>COLOR PALETTE</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedColor('all')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedColor === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: selectedColor === 'all' ? 'var(--surface-sand)' : '#FFFFFF',
                    }}
                  >
                    All
                  </button>
                  {allColors.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-full)',
                        border: selectedColor === clr ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedColor === clr ? 'var(--surface-sand)' : '#FFFFFF',
                        fontWeight: selectedColor === clr ? 600 : 400,
                      }}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>In Stock Only</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={(e) => setDiscountOnly(e.target.checked)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Special Offers / On Sale</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            {/* Top Toolbar: Sorting & Count */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Viewing <strong>{filteredProducts.length}</strong> items
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--text-espresso)' }}>
                  Sort By:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
                >
                  <option value="featured">Featured Atelier Picks</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  padding: '80px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'var(--accent-gold)',
                  }}
                >
                  <Filter size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '8px' }}>No matching products found</h3>
                <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 24px', color: 'var(--text-muted)' }}>
                  We couldn't find any products matching your specific filter criteria. Try adjusting or clearing your filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid-3 shop-product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-start', padding: 0 }}>
          <div
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              padding: '24px',
              overflowY: 'auto',
              animation: 'slideRight 0.3s ease',
            }}
          >
            <style>{`
              @keyframes slideRight {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Filter Catalog</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Same filter fields for mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>CATEGORY</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categoryService.getAllCategories().map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>COLLECTION</label>
                <select
                  className="form-select"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  <option value="all">All Collections</option>
                  {COLLECTIONS.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ fontSize: '12px', margin: 0 }}>MAX PRICE</label>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                APPLY FILTERS ({filteredProducts.length})
              </button>

              <button
                className="btn btn-ghost btn-block btn-sm"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .shop-sidebar {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .shop-product-grid {
            gap: 10px !important;
          }
        }
        @media (max-width: 340px) {
          .shop-product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
