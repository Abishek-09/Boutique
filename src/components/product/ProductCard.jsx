import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { QuickViewModal } from './QuickViewModal';

export const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const inWish = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const mainImage = product.images?.[0] || '';
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <>
      <div
        className="product-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          transition: 'var(--transition)',
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '133%', // 3:4 aspect ratio luxury fashion photography
            backgroundColor: 'var(--surface-sand)',
            overflow: 'hidden',
          }}
        >
          <Link to={`/product/${product.id}`} style={{ position: 'absolute', inset: 0 }}>
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={product.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
                transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          </Link>

          {/* Badges - Minimalist Luxury Outline Chips */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2 }}>
            {hasDiscount && (
              <span className="badge badge-sale">
                <span className="badge-dot" />
                {discountPercent}% OFF
              </span>
            )}
            {product.newArrival && (
              <span className="badge badge-new">
                <span className="badge-dot" />
                NEW
              </span>
            )}
            {product.stock === 0 && (
              <span className="badge badge-danger">
                <span className="badge-dot" />
                SOLD OUT
              </span>
            )}
            {product.stock > 0 && product.stock <= 3 && (
              <span className="badge badge-warning">
                <span className="badge-dot" />
                ONLY {product.stock} LEFT
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`product-card-wishlist-btn ${inWish ? 'in-wishlist' : ''}`}
            title={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart size={14} strokeWidth={1.3} fill={inWish ? 'var(--primary)' : 'none'} className="wishlist-heart-icon" />
          </button>

          {/* Quick View Button for Touch/Mobile */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="product-card-quickview-mobile"
            style={{
              position: 'absolute',
              top: '48px',
              right: '10px',
              zIndex: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--text-espresso)',
              border: '1px solid var(--border)',
            }}
            title="Quick view product details"
            aria-label="Quick view"
          >
            <Eye size={13} strokeWidth={1.3} />
          </button>

          {/* Quick View Button overlay on hover (Desktop) */}
          <div
            className="product-card-quickview-desktop"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              zIndex: 3,
              display: 'flex',
              gap: '6px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'var(--transition-smooth)',
            }}
          >
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="btn btn-sm btn-block"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(6px)',
                border: '1px solid var(--border)',
                color: 'var(--text-espresso)',
                boxShadow: '0 4px 12px rgba(28, 25, 23, 0.08)',
                fontSize: '10.5px',
                padding: '9px 12px',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              <Eye size={13} strokeWidth={1.3} /> QUICK VIEW
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="product-card-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {product.category}
            </span>
            {product.rating && (
              <span style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                ★ {product.rating}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="product-card-title"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.4,
              color: 'var(--text-espresso)',
              marginBottom: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'var(--transition)',
            }}
          >
            {product.name}
          </Link>

          {/* Prices */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', marginBottom: '14px' }}>
            <span className="product-card-price" style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600, color: 'var(--text-espresso)', letterSpacing: '0.02em' }}>
              ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-light)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            className="btn btn-sm btn-block product-card-add-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            aria-label={product.stock === 0 ? 'Sold out' : `Add ${product.name} to cart`}
          >
            <ShoppingBag size={13} strokeWidth={1.3} />
            <span>{product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}</span>
          </button>
        </div>
      </div>

      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}

      <style>{`
        .product-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(28, 25, 23, 0.08);
          border-color: var(--accent-gold);
        }
        .product-card-title:hover {
          color: var(--primary) !important;
        }
        .product-card-wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 3;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(4px);
          color: var(--text-espresso);
          border: 1px solid rgba(197, 160, 89, 0.3);
          box-shadow: 0 2px 8px rgba(28, 25, 23, 0.08);
          transition: var(--transition-smooth);
          cursor: pointer;
        }
        .wishlist-heart-icon {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), fill 0.2s ease, color 0.2s ease;
        }
        .product-card-wishlist-btn:hover {
          transform: scale(1.15);
          background-color: #FFFFFF;
          color: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 4px 14px rgba(88, 17, 26, 0.25);
        }
        .product-card-wishlist-btn:hover .wishlist-heart-icon {
          transform: scale(1.1);
        }
        .product-card-wishlist-btn.in-wishlist {
          color: var(--primary);
          background-color: #FFFFFF;
          border-color: var(--primary);
          box-shadow: 0 2px 10px rgba(88, 17, 26, 0.2);
        }
        .product-card-wishlist-btn.in-wishlist:hover {
          transform: scale(1.18);
          box-shadow: 0 6px 18px rgba(88, 17, 26, 0.35);
          border-color: var(--primary);
        }
        .product-card-wishlist-btn:active {
          transform: scale(0.94);
        }
        .product-card-quickview-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .product-card-quickview-mobile {
            display: flex !important;
          }
          .product-card-quickview-desktop {
            display: none !important;
          }
          .product-card-body {
            padding: 12px !important;
          }
          .product-card-title {
            font-size: 13px !important;
            margin-bottom: 6px !important;
          }
          .product-card-price {
            font-size: 15px !important;
          }
          .product-card-add-btn {
            font-size: 10px !important;
            padding: 7px 8px !important;
          }
        }
      `}</style>
    </>
  );
};
