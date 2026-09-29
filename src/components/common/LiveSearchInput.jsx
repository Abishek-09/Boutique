import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Tag, Layers, ShoppingBag, AlertCircle, Check, Copy } from 'lucide-react';
import { productService } from '../../services/productService';
import { useApp } from '../../context/AppContext';

export const LiveSearchInput = ({
  value = '',
  onChange,
  onSubmit,
  scope = 'shop',
  scopeLabel = 'Entire Store',
  placeholder = 'Search by product name, fabric, or SKU...',
  collectionSlug,
  extraParams = {},
  showSubmitButton = true,
  buttonText = 'SEARCH',
  autoFocus = false,
  className = '',
  style = {},
  inputStyle = {},
}) => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [internalValue, setInternalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync internal value with prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search suggestions
  const suggestions = useMemo(() => {
    if (!internalValue || internalValue.trim().length < 2) {
      return null;
    }
    return productService.getSearchSuggestions(internalValue, scope, { collectionSlug, ...extraParams });
  }, [internalValue, scope, collectionSlug, extraParams]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setInternalValue(newVal);
    if (onChange) onChange(newVal);
    if (newVal.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    if (onSubmit) {
      onSubmit(internalValue);
    }
  };

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSelectCollection = (slug) => {
    setIsOpen(false);
    navigate(`/collections/${slug}`);
  };

  const handleSelectTag = (tag) => {
    setInternalValue(tag);
    if (onChange) onChange(tag);
    setIsOpen(true);
  };

  const handleCopyVoucher = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    showToast(`Voucher code "${code}" copied to clipboard!`, 'success');
  };

  // Helper to highlight matching text
  const renderHighlighted = (text = '', query = '') => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={i} style={{ color: 'var(--primary)', fontWeight: 700 }}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const hasSuggestions = suggestions && (
    suggestions.inScopeMatches.length > 0 ||
    suggestions.matchingCollections.length > 0 ||
    suggestions.matchingVouchers.length > 0 ||
    suggestions.otherSectionMatches.length > 0
  );

  return (
    <div
      ref={containerRef}
      className={`live-search-container ${className}`}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
        <div style={{ position: 'relative', flex: 1, width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          <input
            ref={inputRef}
            type="text"
            className="form-input"
            autoFocus={autoFocus}
            placeholder={placeholder}
            value={internalValue}
            onChange={handleChange}
            onFocus={() => {
              if (internalValue.trim().length >= 2) setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
            style={{
              paddingLeft: '38px',
              paddingRight: internalValue ? '36px' : '14px',
              height: '42px',
              fontSize: '13px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              ...inputStyle,
            }}
          />

          {internalValue && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {showSubmitButton && (
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ height: '42px', padding: '0 20px', flexShrink: 0, fontWeight: 600, letterSpacing: '0.04em' }}
          >
            {buttonText} <ArrowRight size={14} />
          </button>
        )}
      </form>

      {/* Floating Suggestions Dropdown */}
      {isOpen && suggestions && (
        <div
          className="live-search-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 40px rgba(74, 65, 60, 0.18)',
            zIndex: 1100,
            maxHeight: '460px',
            overflowY: 'auto',
            animation: 'fadeIn 0.15s ease',
            textAlign: 'left',
          }}
        >
          {/* Group 1: Items In Current Scope */}
          {suggestions.inScopeMatches.length > 0 && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>
                  In {scopeLabel} ({suggestions.inScopeTotal})
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Instant Match</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestions.inScopeMatches.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    className="suggestion-row"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      style={{
                        width: '40px',
                        height: '52px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--surface-sand)',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-espresso)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {renderHighlighted(product.name, suggestions.query)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
                        {product.material && <span>• {product.material.split(' ')[0]}</span>}
                        {product.newArrival && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>• New</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                      </div>
                      {product.salePrice && product.salePrice < product.price && (
                        <div style={{ fontSize: '11px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Matching Collection Capsules */}
          {suggestions.matchingCollections.length > 0 && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', backgroundColor: '#FAF9F8' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Matching Collections ({suggestions.matchingCollections.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestions.matchingCollections.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => handleSelectCollection(col.slug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                    }}
                    className="suggestion-row"
                  >
                    <img
                      src={col.banner}
                      alt={col.name}
                      style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-espresso)' }}>
                        {renderHighlighted(col.name, suggestions.query)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {col.itemCount} pieces • Explore Capsule ➔
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Matching Vouchers */}
          {suggestions.matchingVouchers.length > 0 && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', backgroundColor: '#FDFBFA' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Matching Atelier Voucher
              </span>
              {suggestions.matchingVouchers.map((coupon) => (
                <div
                  key={coupon.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px dashed var(--accent-sand)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <div>
                    <code style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                      {coupon.code}
                    </code>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      {coupon.description}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyVoucher(coupon.code);
                    }}
                    className="btn btn-ghost btn-xs"
                    style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Group 4: NOT IN THIS SECTION Alert & Cross-Section Suggestions */}
          {scope !== 'shop' && scope !== 'all' && suggestions.inScopeMatches.length === 0 && suggestions.otherSectionMatches.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Informative Alert Banner */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(197, 160, 89, 0.12)',
                  borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  <AlertCircle size={16} />
                  <span>Not found in {scopeLabel}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-espresso)', lineHeight: 1.5 }}>
                  No items matching "{suggestions.query}" are available inside <strong>{scopeLabel}</strong>.
                  However, we found <strong>{suggestions.otherSectionTotal} matching {suggestions.otherSectionTotal === 1 ? 'piece' : 'pieces'}</strong> in other sections of our atelier:
                </p>
              </div>

              {/* Cross-section matching items list */}
              <div style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Available in Other Boutique Sections ({suggestions.otherSectionTotal})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {suggestions.otherSectionMatches.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                      }}
                      className="suggestion-row"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        style={{
                          width: '40px',
                          height: '52px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--surface-sand)',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-espresso)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {renderHighlighted(product.name, suggestions.query)}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span
                            style={{
                              backgroundColor: 'var(--surface-sand)',
                              color: 'var(--primary)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-xs)',
                              fontWeight: 600,
                              fontSize: '10px',
                            }}
                          >
                            ✦ {product.sectionTag}
                          </span>
                          <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                          ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Group 5: NO MATCHES ANYWHERE Fallback */}
          {!hasSuggestions && (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  color: 'var(--accent-gold)',
                }}
              >
                <Search size={20} />
              </div>
              <h4 style={{ fontSize: '15px', color: 'var(--text-espresso)', margin: '0 0 6px', fontWeight: 600 }}>
                No heirloom pieces found matching "{suggestions.query}"
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                {scope !== 'shop'
                  ? `This item does not exist in ${scopeLabel} or across our boutique catalog.`
                  : 'Check spelling or explore our popular weaves & collections:'}
              </p>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Silk', 'Saree', 'Kurti', 'Banarasi', 'Chanderi', 'Zari', 'Terracotta'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className="btn btn-ghost btn-xs"
                    style={{
                      border: '1px solid var(--border)',
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    ✦ {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dropdown Footer Action */}
          <div
            onClick={handleSubmit}
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--bg-base)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--primary)',
            }}
            className="suggestion-footer"
          >
            <span>
              {hasSuggestions
                ? `View all matching results for "${suggestions.query}"`
                : `Search catalog for "${suggestions.query}"`}
            </span>
            <ArrowRight size={14} />
          </div>
        </div>
      )}

      <style>{`
        .suggestion-row:hover {
          background-color: var(--surface-sand) !important;
        }
        .suggestion-footer:hover {
          background-color: var(--surface-sand) !important;
          color: var(--text-espresso) !important;
        }
      `}</style>
    </div>
  );
};
