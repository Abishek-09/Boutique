import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Save, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useApp } from '../../context/AppContext';

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { showToast } = useApp();

  // Status Selector State
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // Shipping Form State
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');

  const loadOrder = () => {
    const found = orderService.getOrderById(id);
    if (found) {
      setOrder(found);
      setNewStatus(found.status);
      if (found.shippingInfo) {
        setCourierName(found.shippingInfo.courierName || 'BlueDart Express');
        setTrackingNumber(found.shippingInfo.trackingNumber || '');
        setTrackingUrl(found.shippingInfo.trackingUrl || '');
        setShippingDate(found.shippingInfo.shippingDate || '');
        setExpectedDelivery(found.shippingInfo.expectedDelivery || '');
      } else {
        const today = new Date().toISOString().split('T')[0];
        setShippingDate(today);
        setExpectedDelivery('Within 2-3 business days');
        setTrackingNumber(`BD${Math.floor(100000000 + Math.random() * 900000000)}`);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadOrder();
  }, [id]);

  if (!order) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/admin/orders" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const allStatuses = [
    'Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Return Requested',
    'Returned',
    'Refunded',
  ];

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (newStatus === order.status && !statusNote) return;

    orderService.updateOrderStatus(order.id, newStatus, statusNote || null);
    setStatusNote('');
    loadOrder();
    showToast(`Order status successfully updated to ${newStatus}`, 'success');
  };

  const handleSaveShipping = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      showToast('Tracking number is required', 'error');
      return;
    }

    const finalUrl = trackingUrl.trim() || `https://www.bluedart.com/tracking/${trackingNumber.trim()}`;

    orderService.updateCourierDetails(order.id, {
      courierName,
      trackingNumber: trackingNumber.trim(),
      trackingUrl: finalUrl,
      shippingDate,
      expectedDelivery,
    });

    loadOrder();
    showToast('Courier details saved. Customer order tracking updated!', 'success');
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/admin/orders" className="btn btn-sand btn-sm">
            <ArrowLeft size={15} /> Back to Orders
          </Link>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              Order Details: {order.orderNumber}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Received on {new Date(order.orderDate).toLocaleString('en-GB')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="badge badge-sale" style={{ fontSize: '13px', padding: '6px 14px' }}>
            Current Status: {order.status}
          </span>
          <Link
            to={`/account/orders/${order.orderNumber}`}
            target="_blank"
            className="btn btn-outline btn-sm"
          >
            Customer View ↗
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '28px' }} className="admin-order-grid">
        {/* Left Column: Fulfillment & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Order Status Transition Form */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              1. Update Order Status
            </h3>

            <form onSubmit={handleUpdateStatus}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }} className="status-inputs">
                <div className="form-group">
                  <label className="form-label">CHANGE STATUS TO</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">TIMELINE NOTE (OPTIONAL)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Verified by master tailor"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  UPDATE STATUS
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Courier Details Form */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <Truck size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', margin: 0 }}>
                2. Courier & Shipping Details
              </h3>
            </div>

            <form onSubmit={handleSaveShipping}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="courier-inputs">
                <div className="form-group">
                  <label className="form-label">COURIER SERVICE NAME</label>
                  <select
                    className="form-select"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                  >
                    <option value="BlueDart Express">BlueDart Express</option>
                    <option value="DTDC Courier">DTDC Courier</option>
                    <option value="Delhivery Surface">Delhivery Surface</option>
                    <option value="Shadowfax Local">Shadowfax Local</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">WAYBILL / TRACKING AWB *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">DISPATCH DATE</label>
                  <input
                    type="date"
                    className="form-input"
                    value={shippingDate}
                    onChange={(e) => setShippingDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">EXPECTED DELIVERY</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Within 2-3 business days"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">TRACKING PORTAL URL (OPTIONAL)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://www.bluedart.com/tracking/..."
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Saving automatically advances order status to <strong>Shipped</strong> and activates customer tracking.
                </span>

                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={14} /> SAVE SHIPPING DETAILS
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Ordered Products */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              3. Ordered Garments & Items ({order.items.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '60px', height: '76px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', margin: '0 0 4px' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 6px' }}>
                      Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong> • SKU: {item.sku}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                      <strong style={{ fontSize: '14px' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Invoice Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Customer Profile Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              Customer Details
            </h3>
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '14px' }}>{order.customer.name}</p>
            <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>Email: {order.customer.email}</p>
            <p style={{ margin: '0 0 14px', color: 'var(--text-muted)' }}>Phone: {order.customer.phone}</p>
            <Link to="/admin/customers" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
              View Patron History →
            </Link>
          </div>

          {/* Delivery Address Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              Shipping Address
            </h3>
            <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{order.shippingAddress.name}</p>
            <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>{order.shippingAddress.addressLine}</p>
            <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Contact: {order.shippingAddress.phone}</p>
          </div>

          {/* Financials Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              Financial Breakdown
            </h3>

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
                <span>Shipping Fee</span>
                <span>{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST (5%)</span>
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
                <span>Total Amount</span>
                <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-xs)', fontSize: '12px' }}>
              <span>Payment: <strong>{order.payment.method}</strong></span>
              <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '2px' }}>
                Status: <strong>{order.payment.status}</strong> • Ref: {order.payment.transactionId}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-order-grid {
            grid-template-columns: 1fr !important;
          }
          .status-inputs, .courier-inputs {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
