import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '80vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>My Wishlist</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '0.04em', margin: 0 }}>Saved Wishlist</h1>
            <p style={{ fontSize: '14px', margin: '4px 0 0' }}>
              {wishlist.length} heirloom piece{wishlist.length !== 1 ? 's' : ''} saved for your private wardrobe
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              Clear Entire Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '80px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--accent-gold)',
              }}
            >
              <Heart size={30} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 28px' }}>
              Save your favorite handwoven sarees, bespoke tunics, and jewellery while browsing to view them anytime.
            </p>
            <Link to="/shop" className="btn btn-primary btn-sm">
              EXPLORE BOUTIQUE CATALOG <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid-4">
            {wishlist.map((item) => {
              const hasDiscount = item.salePrice && item.salePrice < item.price;
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: '133%', backgroundColor: 'var(--surface-alt)' }}>
                    <Link to={`/product/${item.id}`} style={{ position: 'absolute', inset: 0 }}>
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(item.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--danger)',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                      }}
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      {item.category}
                    </span>
                    <Link
                      to={`/product/${item.id}`}
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 1.35,
                        margin: '4px 0 8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.name}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', marginBottom: '14px' }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-espresso)' }}>
                        ₹{(item.salePrice || item.price).toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.stock === 0}
                    >
                      <ShoppingBag size={14} />
                      {item.stock === 0 ? 'OUT OF STOCK' : 'MOVE TO BAG'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
