import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2, Lock } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export const PaymentDemoModal = ({ amount, paymentMethod, onPaymentSuccess, onCancel }) => {
  useScrollLock(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('Ananya Verma');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const isOnline = paymentMethod.includes('Online') || paymentMethod.includes('Card');

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: '500px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--text-espresso)',
            color: '#FFFFFF',
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-sand)', fontWeight: 600 }}>
              MAISON D'OR DEMO GATEWAY
            </span>
            <h3 style={{ fontSize: '18px', margin: '4px 0 0', color: '#FFFFFF' }}>
              Simulated Payment Authorization
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-sand)' }}>Amount Payable</span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
              ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--warning-bg)',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--warning)',
          }}
        >
          <Lock size={15} />
          <span>
            <strong>Client Demo Mode:</strong> Test environment. No real funds are processed.
          </span>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} style={{ padding: '24px' }}>
          {isOnline ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-espresso)' }}>
                <CreditCard size={18} color="var(--primary)" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Simulated Card Details</span>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>NAME ON CARD</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>CARD NUMBER (TEST)</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>EXPIRY DATE</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>CVV</label>
                  <input
                    type="password"
                    className="form-input"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <CheckCircle2 size={44} color="var(--success)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Cash on Delivery Selected</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Pay cash or scan QR upon delivery at your doorstep. No prepayment required.
              </p>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>Authorizing Demo Transaction...</span>
              ) : (
                <span>
                  {isOnline ? `PAY ₹${amount.toLocaleString('en-IN')} (DEMO)` : 'CONFIRM COD ORDER'}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost btn-sm"
              disabled={isProcessing}
            >
              Cancel & Return to Checkout
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
