import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      const res = applyCoupon(couponCode);
      if (res.success) {
        setCouponCode('');
      }
    }
  };

  const freeShippingThreshold = 1999;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '80vh', padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '650px', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '60px 30px',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--accent-gold)',
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', letterSpacing: '0.04em', marginBottom: '8px' }}>Your Shopping Bag is Empty</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
              You have not added any pieces from our atelier yet. Explore our handcrafted collections of pure silks and festive ensembles.
            </p>
            <Link to="/shop" className="btn btn-primary btn-sm">
              EXPLORE ATELIER COLLECTION <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '80vh', padding: '40px 0 90px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Shopping Bag</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '0.04em', margin: 0 }}>Review Shopping Bag</h1>
          <p style={{ fontSize: '14px', margin: '4px 0 0' }}>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your bespoke cart
          </p>
        </div>

        {/* Free Shipping Progress bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            padding: '16px 24px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            {freeShippingDiff > 0 ? (
              <span>
                Add <strong>₹{freeShippingDiff.toLocaleString('en-IN')}</strong> more to unlock{' '}
                <strong style={{ color: 'var(--primary)' }}>Free Express Delivery</strong>
              </span>
            ) : (
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                ✓ Congratulations! You've unlocked Complimentary Express Delivery
              </span>
            )}
            <span style={{ color: 'var(--text-muted)' }}>{freeShippingProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: freeShippingDiff === 0 ? 'var(--success)' : 'var(--primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }} className="cart-grid">
          {/* Left: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: 'var(--surface-alt)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Product Details
                </span>
                <button
                  onClick={clearCart}
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}
                >
                  Clear Bag
                </button>
              </div>

              <div style={{ padding: '0 20px' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="cart-item-row"
                    style={{
                      display: 'flex',
                      gap: '20px',
                      padding: '24px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                      style={{
                        width: '100px',
                        height: '130px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--surface-alt)',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                            {item.category}
                          </span>
                          <h3 style={{ fontSize: '16px', margin: '2px 0 6px' }}>
                            <Link to={`/product/${item.productId}`} style={{ color: 'var(--text-espresso)' }}>
                              {item.name}
                            </Link>
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          style={{ color: 'var(--text-muted)', padding: '4px' }}
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        <span>Size: <strong style={{ color: 'var(--text-espresso)' }}>{item.size}</strong></span>
                        <span>Color: <strong style={{ color: 'var(--text-espresso)' }}>{item.color}</strong></span>
                        <span>SKU: {item.sku}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        {/* Quantity adjuster */}
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
                            style={{ padding: '6px 12px', color: 'var(--text-espresso)' }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 10px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            style={{ padding: '6px 12px', color: 'var(--text-espresso)' }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-espresso)' }}>
                            ₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                              ₹{(item.salePrice || item.price).toLocaleString('en-IN')} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/shop" className="btn btn-sand btn-sm">
                ← CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                padding: '24px',
                position: 'sticky',
                top: '116px',
              }}
            >
              <h3 style={{ fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div style={{ marginBottom: '20px' }}>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ fontSize: '13px', textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">
                    Apply
                  </button>
                </form>

                {/* Suggestions */}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Demo codes: <strong style={{ color: 'var(--primary)' }}>WELCOME10</strong> (10% off) •{' '}
                  <strong style={{ color: 'var(--primary)' }}>FESTIVE15</strong> (15% off)
                </div>

                {appliedCoupon && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      backgroundColor: 'var(--success-bg)',
                      borderRadius: 'var(--radius-xs)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: 'var(--success)',
                    }}
                  >
                    <span>
                      ✓ <strong>{appliedCoupon.code}</strong> Applied (-₹{discountAmount})
                    </span>
                    <button onClick={removeCoupon} style={{ color: 'var(--danger)', fontWeight: 600 }}>
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Totals Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                    <span>Promotion Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Express Boutique Delivery</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Handloom GST (5%)</span>
                  <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--text-espresso)',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span>Estimated Total</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={() => navigate('/checkout')}
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-light)' }}>
                <ShieldCheck size={14} />
                <span>Simulated Secure Checkout • Client Demo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .cart-item-row {
            gap: 12px !important;
            padding: 16px 0 !important;
          }
          .cart-item-img {
            width: 80px !important;
            height: 104px !important;
          }
        }
      `}</style>
    </div>
  );
};
