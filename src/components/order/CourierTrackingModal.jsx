import React from 'react';
import { createPortal } from 'react-dom';
import { X, Truck, CheckCircle2, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export const CourierTrackingModal = ({ shippingInfo, orderNumber, onClose }) => {
  useScrollLock(Boolean(shippingInfo));

  if (!shippingInfo) return null;

  const trackingNumber = shippingInfo.trackingNumber || 'BD123456789';
  const courierName = shippingInfo.courierName || 'BlueDart Express';
  const shippingDate = shippingInfo.shippingDate || '2026-03-20';
  const expectedDelivery = shippingInfo.expectedDelivery || 'Within 2-3 business days';

  const mockCheckpoints = [
    {
      title: 'Shipment Out for Delivery',
      location: 'Bengaluru Central Delivery Hub',
      time: 'Today, 09:30 AM',
      completed: true,
      current: true,
    },
    {
      title: 'Arrived at Destination Transit Facility',
      location: 'Bengaluru Sort Facility (BLR/HUB-4)',
      time: 'Yesterday, 07:45 PM',
      completed: true,
      current: false,
    },
    {
      title: 'In Transit between Logistics Terminals',
      location: 'South Regional Sorting Center',
      time: '2026-03-21, 02:15 AM',
      completed: true,
      current: false,
    },
    {
      title: 'Handed Over & Scanned by Courier Partner',
      location: 'Maison D’Or Bengaluru Atelier Hub',
      time: `${shippingDate}, 04:30 PM`,
      completed: true,
      current: false,
    },
    {
      title: 'Electronic Shipping Manifest Generated',
      location: 'Atelier Dispatch Terminal',
      time: `${shippingDate}, 11:00 AM`,
      completed: true,
      current: false,
    },
  ];

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px', padding: 0, overflow: 'hidden' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={20} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-sand)', fontWeight: 600 }}>
                LIVE SHIPMENT TRACKER
              </span>
              <h3 style={{ fontSize: '18px', margin: '2px 0 0', color: '#FFFFFF' }}>
                {courierName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#FFFFFF', opacity: 0.8, padding: '4px' }}
            aria-label="Close tracking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tracking Details Strip */}
        <div
          className="tracking-strip"
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--surface-sand)',
            borderBottom: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '16px',
            fontSize: '13px',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
              WAYBILL / TRACKING AWB
            </span>
            <strong style={{ fontSize: '15px', color: 'var(--primary)', letterSpacing: '0.04em' }}>
              {trackingNumber}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
              ESTIMATED DELIVERY
            </span>
            <strong style={{ fontSize: '14px', color: 'var(--text-espresso)' }}>
              {expectedDelivery}
            </strong>
          </div>
        </div>

        {/* Prototype representation notice */}
        <div style={{ padding: '10px 24px', backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)' }}>
          ℹ️ Courier tracking is handled by the delivery partner. Live waybill simulation for Order <strong>{orderNumber}</strong>.
        </div>

        {/* Checkpoint Timeline */}
        <div style={{ padding: '24px', maxHeight: '360px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {mockCheckpoints.map((cp, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: cp.current ? 'var(--primary)' : 'var(--surface-alt)',
                      border: cp.current ? '2px solid var(--primary)' : '2px solid var(--border-strong)',
                      color: cp.current ? '#FFFFFF' : 'var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    {cp.current ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                  </div>
                  {idx < mockCheckpoints.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        flex: 1,
                        backgroundColor: cp.completed ? 'var(--primary)' : 'var(--border)',
                        marginTop: '4px',
                        minHeight: '28px',
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1, paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                    <h4 style={{ fontSize: '14px', margin: 0, color: cp.current ? 'var(--primary)' : 'var(--text-espresso)' }}>
                      {cp.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                      {cp.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    {cp.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="tracking-modal-footer"
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--surface-alt)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <a
            href={shippingInfo.trackingUrl || `https://www.bluedart.com/tracking/${trackingNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: 'var(--accent-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
            }}
          >
            Open Official Partner Portal <ExternalLink size={12} />
          </a>

          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close Tracking
          </button>
        </div>

        <style>{`
          @media (max-width: 540px) {
            .tracking-strip {
              grid-template-columns: 1fr !important;
              gap: 10px !important;
            }
            .tracking-modal-footer {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .tracking-modal-footer button {
              width: 100% !important;
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};
