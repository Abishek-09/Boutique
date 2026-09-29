import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Heart, Star, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useScrollLock } from '../../hooks/useScrollLock';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  useScrollLock(true);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '');

  const inWish = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ overscrollBehavior: 'contain' }}>
      <div
        className="modal-content quickview-modal-content"
        style={{
          maxWidth: '840px',
          padding: 0,
          overflow: 'hidden',
          maxHeight: '90vh',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '50%',
            padding: '6px',
            color: 'var(--text-espresso)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            border: '1px solid var(--border)',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div
          className="quickview-modal-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            minHeight: 'auto',
            maxHeight: 'min(620px, 88vh)',
          }}
        >
          {/* Left: Product Images */}
          <div
            className="quickview-image-pane"
            style={{
              backgroundColor: 'var(--surface-sand)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="quickview-image-main"
              style={{
                flex: 1,
                minHeight: '300px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {hasDiscount && (
                <span className="badge badge-sale" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', flexShrink: 0 }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '54px',
                      height: '66px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Options */}
          <div
            className="quickview-details-pane"
            style={{
              padding: '24px 26px 20px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                {product.category}
              </span>
              <span style={{ color: 'var(--border-strong)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', lineHeight: 1.25, margin: '0 0 6px', color: 'var(--text-espresso)' }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', color: 'var(--primary)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < Math.floor(product.rating) ? 'var(--primary)' : 'none'}
                    stroke="var(--primary)"
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{product.rating}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '21px', fontWeight: 700, color: 'var(--text-espresso)' }}>
                ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-light)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Description clamped so it doesn't push the buttons below */}
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: '0 0 12px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={product.description}
            >
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SELECT SIZE
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '5px 12px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-xs)',
                        border: selectedSize === sz ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedSize === sz ? 'var(--primary-light)' : '#FFFFFF',
                        color: selectedSize === sz ? 'var(--primary)' : 'var(--text-espresso)',
                        fontWeight: selectedSize === sz ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  COLOR: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedColor}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-full)',
                        border: selectedColor === c ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedColor === c ? 'var(--surface-sand)' : '#FFFFFF',
                        fontWeight: selectedColor === c ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div style={{ marginBottom: '12px' }}>
              {product.stock > 0 ? (
                <span style={{ fontSize: '11px', color: product.stock < 5 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                  ● {product.stock < 5 ? `Only ${product.stock} left in boutique stock` : 'In Stock & Ready to Dispatch'}
                </span>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>
                  ● Currently Out of Stock
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '10px' }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1, height: '40px', fontWeight: 600 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={15} />
                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>

              <button
                type="button"
                className="btn btn-sand"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Wishlist toggle"
                title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={17} fill={inWish ? 'var(--primary)' : 'none'} color={inWish ? 'var(--primary)' : 'var(--text-espresso)'} />
              </button>
            </div>

            {/* View Full Product Details Styled Button */}
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="quickview-details-btn"
            >
              <span>View Full Product Details</span>
              <ArrowRight size={13} className="quickview-details-arrow" />
            </Link>
          </div>
        </div>

        <style>{`
          .quickview-details-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            padding: 8px 16px;
            font-size: 11px;
            letter-spacing: 0.08em;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--primary);
            border: 1px solid var(--accent-sand);
            border-radius: var(--radius-xs);
            background-color: var(--bg-base);
            text-decoration: none;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
            box-sizing: border-box;
          }
          .quickview-details-btn:hover {
            background-color: var(--primary) !important;
            color: #FFFFFF !important;
            border-color: var(--primary) !important;
            box-shadow: 0 4px 12px rgba(88, 17, 26, 0.25);
          }
          .quickview-details-btn:hover .quickview-details-arrow {
            transform: translateX(4px);
          }
          .quickview-details-arrow {
            transition: transform 0.25s ease;
          }
          @media (max-width: 768px) {
            .quickview-modal-grid {
              grid-template-columns: 1fr !important;
              min-height: auto !important;
              max-height: none !important;
            }
            .quickview-details-pane {
              padding: 20px 16px !important;
              max-height: none !important;
            }
            .quickview-image-pane {
              padding: 16px !important;
              height: auto !important;
            }
            .quickview-image-main {
              min-height: 240px !important;
              max-height: 320px !important;
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};
