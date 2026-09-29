import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useScrollLock } from '../../hooks/useScrollLock';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  useScrollLock(isCartOpen);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  const freeShippingRemaining = Math.max(0, 1999 - subtotal);

  return createPortal(
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="cart-drawer"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.3s ease',
          position: 'relative',
        }}
      >
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-alt)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', margin: 0, letterSpacing: '0.02em' }}>
              Your Shopping Bag ({cartItems.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ padding: '4px', color: 'var(--text-espresso)', opacity: 0.7 }}
            aria-label="Close cart drawer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free shipping progress */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--surface-sand)',
            borderBottom: '1px solid var(--border)',
            fontSize: '13px',
          }}
        >
          {freeShippingRemaining > 0 ? (
            <p style={{ margin: 0, color: 'var(--text-espresso)' }}>
              Add <strong>₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for{' '}
              <strong style={{ color: 'var(--primary)' }}>Free Express Delivery</strong>
            </p>
          ) : (
            <p style={{ margin: 0, color: 'var(--success)', fontWeight: 600 }}>
              ✓ You’ve unlocked Complimentary Boutique Delivery!
            </p>
          )}
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--accent-gold)',
                }}
              >
                <ShoppingBag size={30} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px' }}>Your bag is empty</h4>
              <p style={{ fontSize: '14px', marginBottom: '24px' }}>
                Discover our handwoven sarees and bespoke artisanal apparel.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bg-base)',
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={() => setIsCartOpen(false)}
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          color: 'var(--text-espresso)',
                          marginBottom: '4px',
                        }}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ color: 'var(--text-light)', padding: '2px' }}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 8px' }}>
                      Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong>
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          style={{ padding: '4px 8px', color: 'var(--text-espresso)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 8px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-espresso)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-espresso)' }}>
                          ₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'var(--surface-alt)',
              borderTop: '1px solid var(--border)',
            }}
          >
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Promo Code (e.g. WELCOME10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{ fontSize: '13px', padding: '8px 12px' }}
              />
              <button type="submit" className="btn btn-outline btn-sm">
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--success-bg)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: 'var(--success)',
                }}
              >
                <span>
                  Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})
                </span>
                <button
                  onClick={removeCoupon}
                  style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '13px' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Subtotal & Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Boutique Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-espresso)',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <span>Estimated Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-sand btn-block btn-sm"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
              >
                VIEW DETAILED CART
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
