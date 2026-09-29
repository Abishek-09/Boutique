import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, CheckCircle2, Clock, MapPin, Package, Star, ArrowLeft, ExternalLink } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { CourierTrackingModal } from '../../components/order/CourierTrackingModal';
import { ReviewModal } from '../../components/order/ReviewModal';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState(null); // Selected product for review modal

  const loadOrder = () => {
    const found = orderService.getOrderById(id);
    setOrder(found);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ margin: '12px 0 24px' }}>Could not locate details for order reference "{id}".</p>
        <Link to="/account/orders" className="btn btn-primary btn-sm">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const stages = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStageIndex = stages.indexOf(order.status);

  const isDelivered = order.status === 'Delivered';
  const isShipped = order.status === 'Shipped' || isDelivered;

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', padding: '40px 0 90px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/account/orders" style={{ textDecoration: 'underline' }}>My Orders</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.orderNumber}</span>
        </div>

        {/* Top Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '28px 32px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                ATELIER ORDER REFERENCE
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 8px' }}>
                Order #{order.orderNumber}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Placed on {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span
                className="badge"
                style={{
                  backgroundColor: isDelivered ? 'var(--success-bg)' : isShipped ? 'var(--primary-light)' : 'var(--warning-bg)',
                  color: isDelivered ? 'var(--success)' : isShipped ? 'var(--primary)' : 'var(--warning)',
                  fontSize: '13px',
                  padding: '6px 14px',
                }}
              >
                ● Status: {order.status}
              </span>

              {order.shippingInfo && (
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Truck size={15} /> TRACK SHIPMENT
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Order Timeline Progress */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '32px',
            marginBottom: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Order Fulfillment Journey</h3>

          {/* Stepper Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              position: 'relative',
              textAlign: 'center',
            }}
            className="timeline-grid"
          >
            {stages.map((stage, idx) => {
              const isCompleted = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--primary)' : 'var(--surface-sand)',
                      color: isCompleted ? '#FFFFFF' : 'var(--text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginBottom: '10px',
                      border: isCurrent ? '3px solid var(--accent-sand)' : 'none',
                      transition: 'var(--transition)',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <strong style={{ fontSize: '13px', color: isCompleted ? 'var(--text-espresso)' : 'var(--text-light)' }}>
                    {stage}
                  </strong>
                  {isCurrent && (
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                      Current Stage
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Events Log */}
          {order.timeline && order.timeline.length > 0 && (
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                Event Log
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                {order.timeline.map((event, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>
                      <strong style={{ color: 'var(--text-espresso)' }}>{event.status}:</strong> {event.note}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Courier Details Box (if Shipped or Delivered) */}
        {order.shippingInfo && (
          <div
            style={{
              backgroundColor: 'var(--surface-sand)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              padding: '24px 32px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Truck size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '16px', margin: 0 }}>Courier Shipping Details</h4>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Courier: <strong>{order.shippingInfo.courierName}</strong> • Waybill Tracking AWB:{' '}
                <strong style={{ color: 'var(--primary)' }}>{order.shippingInfo.trackingNumber}</strong>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Dispatched: {order.shippingInfo.shippingDate} • Expected: {order.shippingInfo.expectedDelivery}
              </p>
            </div>

            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="btn btn-sand btn-sm"
            >
              TRACK WAYBILL STATUS <ExternalLink size={13} />
            </button>
          </div>
        )}

        {/* 2-Column Grid: Ordered Items + Order Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px' }} className="order-bottom-grid">
          {/* Items List with Review Trigger */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Purchased Atelier Items</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '15px', margin: '0 0 4px' }}>
                      <Link to={`/product/${item.productId}`} style={{ color: 'var(--text-espresso)' }}>
                        {item.name}
                      </Link>
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 6px' }}>
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Review button: ONLY visible for Delivered orders */}
                    {isDelivered && (
                      <div style={{ marginTop: '10px' }}>
                        {order.reviewGiven ? (
                          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ✓ Review Submitted for Atelier Approval
                          </span>
                        ) : (
                          <button
                            onClick={() => setReviewItem(item)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '11px', padding: '4px 10px', borderColor: 'var(--accent-gold)' }}
                          >
                            <Star size={12} color="var(--primary)" /> Write a Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Address */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                padding: '24px',
                fontSize: '13px',
              }}
            >
              <h4 style={{ fontSize: '15px', margin: '0 0 12px' }}>Shipping Address</h4>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{order.shippingAddress.name}</p>
              <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>{order.shippingAddress.addressLine}</p>
              <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Financial Summary */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                padding: '24px',
                fontSize: '13px',
              }}
            >
              <h4 style={{ fontSize: '15px', margin: '0 0 12px' }}>Payment & Invoice</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                    <span>Discount</span>
                    <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
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
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-espresso)',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span>Total</span>
                  <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-xs)', fontSize: '12px' }}>
                <span>Method: <strong>{order.payment.method}</strong></span>
                <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Status: <strong>{order.payment.status}</strong> (Ref: {order.payment.transactionId})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courier Tracking Modal */}
      {isTrackingModalOpen && order.shippingInfo && (
        <CourierTrackingModal
          shippingInfo={order.shippingInfo}
          orderNumber={order.orderNumber}
          onClose={() => setIsTrackingModalOpen(false)}
        />
      )}

      {/* Review Modal */}
      {reviewItem && (
        <ReviewModal
          order={order}
          product={reviewItem}
          onClose={() => setReviewItem(null)}
          onSuccess={() => loadOrder()}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .order-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
