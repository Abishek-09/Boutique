import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { PaymentDemoModal } from '../../components/checkout/PaymentDemoModal';

export const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, shippingFee, taxAmount, total, clearCart } = useCart();
  const { customerUser } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  // Multi-step indicator
  const [currentStep, setCurrentStep] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Form State initialized with realistic demo data
  const [formData, setFormData] = useState({
    name: customerUser?.name || 'Ananya Verma',
    email: customerUser?.email || 'ananya.verma@example.com',
    phone: customerUser?.phone || '+91 98765 43210',
    addressLine: customerUser?.addresses?.[0]?.addressLine || 'Flat 402, Lotus Residency, MG Road',
    city: customerUser?.addresses?.[0]?.city || 'Bengaluru',
    state: customerUser?.addresses?.[0]?.state || 'Karnataka',
    pincode: customerUser?.addresses?.[0]?.pincode || '560001',
    deliveryMethod: 'express', // standard or express
    paymentMethod: 'Online Payment (Credit / Debit Card / UPI)',
  });

  const [formErrors, setFormErrors] = useState({});

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h2>Your bag is empty</h2>
          <p style={{ margin: '12px 0 24px' }}>Please add pieces from our catalog before proceeding to checkout.</p>
          <Link to="/shop" className="btn btn-primary btn-sm">
            Discover Catalog
          </Link>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.addressLine.trim()) errs.addressLine = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      showToast('Please verify all required customer and address fields', 'error');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);

    // Create persistent mock order
    const createdOrder = orderService.createOrder({
      customer: {
        id: customerUser?.id || 'CUST-001',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      items: cartItems,
      pricing: {
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        total,
      },
      paymentMethod: formData.paymentMethod,
    });

    clearCart();
    showToast(`Order ${createdOrder.orderNumber} confirmed!`, 'success');
    navigate(`/order-success/${createdOrder.orderNumber}`);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', padding: '40px 0 90px' }}>
      <div className="container">
        {/* Header Breadcrumb */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Link to="/cart" style={{ textDecoration: 'underline' }}>Shopping Bag</Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Checkout</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', margin: 0, fontWeight: 600 }}>Boutique Concierge Checkout</h1>
        </div>

        {/* Step Indicator - Luxury Hairline Nav */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '36px',
          }}
          className="steps-indicator"
        >
          {[
            { num: 1, label: 'Patron Info' },
            { num: 2, label: 'Atelier Address' },
            { num: 3, label: 'Delivery' },
            { num: 4, label: 'Payment' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num < currentStep) setCurrentStep(s.num);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                backgroundColor: currentStep === s.num ? '#FFFFFF' : 'var(--surface-alt)',
                border: currentStep === s.num ? '1.5px solid var(--accent-gold)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'left',
                cursor: s.num <= currentStep ? 'pointer' : 'default',
                transition: 'var(--transition-smooth)',
                boxShadow: currentStep === s.num ? '0 4px 14px rgba(197, 160, 89, 0.12)' : 'none',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= s.num ? 'var(--primary)' : 'rgba(28, 25, 23, 0.12)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  flexShrink: 0,
                }}
              >
                {s.num}
              </span>
              <span style={{ fontSize: '12px', fontWeight: currentStep === s.num ? 600 : 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: currentStep === s.num ? 'var(--text-espresso)' : 'var(--text-muted)' }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* 2-Column Grid: Multi-Step Forms + Order Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }} className="checkout-layout">
          {/* Left: Form Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '32px',
            }}
          >
            {/* STEP 1: Customer Info */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 1: Contact Information</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  We'll send order updates, dispatch notifications, and shipment tracking to this email.
                </p>

                <div className="form-group">
                  <label className="form-label">FULL NAME *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }} className="grid-2-col">
                  <div className="form-group">
                    <label className="form-label">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">PHONE NUMBER (FOR SMS TRACKING) *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleNextStep} className="btn btn-primary">
                    CONTINUE TO ADDRESS <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Address */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 2: Shipping Address</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Where should our courier partner hand-deliver your handcrafted items?
                </p>

                <div className="form-group">
                  <label className="form-label">FLAT, HOUSE NO., BUILDING & STREET *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  />
                  {formErrors.addressLine && <span className="form-error">{formErrors.addressLine}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }} className="grid-3-col">
                  <div className="form-group">
                    <label className="form-label">CITY *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    {formErrors.city && <span className="form-error">{formErrors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">STATE *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                    {formErrors.state && <span className="form-error">{formErrors.state}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">PINCODE *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                    {formErrors.pincode && <span className="form-error">{formErrors.pincode}</span>}
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-sand btn-sm">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button type="button" onClick={handleNextStep} className="btn btn-primary">
                    CONTINUE TO DELIVERY <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Delivery Options */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 3: Delivery Method</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Select your preferred shipping handling.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '18px',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.deliveryMethod === 'express' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: formData.deliveryMethod === 'express' ? 'var(--primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={formData.deliveryMethod === 'express'}
                      onChange={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '15px' }}>Express Insured Boutique Air Courier</strong>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        Delivered in 2 – 3 business days via BlueDart Air with archival keepsake box & signature required.
                      </p>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-sand btn-sm">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button type="button" onClick={handleNextStep} className="btn btn-primary">
                    CONTINUE TO PAYMENT <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Selection */}
            {currentStep === 4 && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Step 4: Payment Demonstration</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Select demo payment method to simulate the transaction.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                  {/* Option 1: Online Demo */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '18px',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.paymentMethod.includes('Online') ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: formData.paymentMethod.includes('Online') ? 'var(--primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment (Credit / Debit Card / UPI)"
                      checked={formData.paymentMethod.includes('Online')}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <CreditCard size={20} color="var(--primary)" />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '15px' }}>Online Demo Payment (Card / UPI / NetBanking)</strong>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        Simulates instant payment authorization with mock test credentials.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '18px',
                      borderRadius: 'var(--radius-sm)',
                      border: formData.paymentMethod.includes('Cash') ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: formData.paymentMethod.includes('Cash') ? 'var(--primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod.includes('Cash')}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <Banknote size={20} color="var(--primary)" />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '15px' }}>Cash on Delivery (COD)</strong>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        Pay cash or scan partner QR code upon physical delivery.
                      </p>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-sand btn-sm">
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenPayment}
                    className="btn btn-primary btn-lg"
                  >
                    PAY ₹{total.toLocaleString('en-IN')} & PLACE ORDER →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Card */}
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                padding: '24px',
                position: 'sticky',
                top: '116px',
              }}
            >
              <h3 style={{ fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                Bag Summary ({cartItems.length})
              </h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
                {cartItems.map((item) => (
                  <div key={item.cartItemId} style={{ display: 'flex', gap: '12px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 2px', lineHeight: 1.3 }}>{item.name}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>
                        ₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                    <span>Promotion Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Boutique Express Delivery</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Estimated GST (5%)</span>
                  <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: 'var(--text-espresso)',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span>Payable Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--surface-sand)', borderRadius: 'var(--radius-xs)', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '4px' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>Boutique Guarantee</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Insured air transit, authentic handloom weaves, and signature packaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Demo Modal */}
      {isPaymentModalOpen && (
        <PaymentDemoModal
          amount={total}
          paymentMethod={formData.paymentMethod}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setIsPaymentModalOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
          .steps-indicator {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .grid-2-col, .grid-3-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
