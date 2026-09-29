import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { orderService } from '../../services/orderService';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = orderService.getOrderById(id);
    setOrder(found);
  }, [id]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Looking up order confirmation...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', padding: '50px 0 90px' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '48px 40px',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="order-success-card"
        >
          {/* Success Banner */}
          <div style={{ textAlign: 'center', marginBottom: '36px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--success)',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Order Confirmed
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '0.04em', margin: '4px 0 10px' }}>
              Thank You for Your Patronage
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
              We have received your order and our master weavers are preparing your handcrafted package.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--surface-alt)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                marginTop: '20px',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Order Number:</span>
              <strong style={{ fontSize: '16px', color: 'var(--primary)', letterSpacing: '0.04em' }}>
                {order.orderNumber}
              </strong>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              padding: '20px',
              backgroundColor: 'var(--surface-alt)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '32px',
              fontSize: '13px',
            }}
            className="details-grid"
          >
            <div>
              <h4 style={{ fontSize: '14px', margin: '0 0 8px', color: 'var(--text-espresso)' }}>Customer Details</h4>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{order.customer.name}</p>
              <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>{order.customer.email}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{order.customer.phone}</p>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', margin: '0 0 8px', color: 'var(--text-espresso)' }}>Delivery Address</h4>
              <p style={{ margin: '0 0 4px' }}>{order.shippingAddress.addressLine}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--primary)' }}>
                Payment Method: <strong>{order.payment.method}</strong> ({order.payment.status})
              </p>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Artisanal Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '64px', height: '82px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', margin: '0 0 4px' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Breakdown */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--surface-sand)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '36px',
              fontSize: '13px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                <span>Discount Applied</span>
                <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Express Delivery</span>
              <span>{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Handloom GST</span>
              <span>₹{order.pricing.tax.toLocaleString('en-IN')}</span>
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
              <span>Total Paid</span>
              <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/account/orders/${order.orderNumber}`} className="btn btn-primary btn-lg">
              <Truck size={16} /> TRACK & VIEW ORDER
            </Link>

            <Link to="/shop" className="btn btn-outline btn-lg">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .order-success-card {
            padding: 24px 16px !important;
          }
          .details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
