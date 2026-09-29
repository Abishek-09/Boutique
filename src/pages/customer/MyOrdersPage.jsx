import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

export const MyOrdersPage = () => {
  const { customerUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load orders matching customer email or ID, or all if demo user
    const list = orderService.getCustomerOrders(customerUser.email) || [];
    // If no orders under this email, show all orders so client can demo every state easily!
    if (list.length === 0) {
      setOrders(orderService.getAllOrders().slice(0, 6));
    } else {
      setOrders(list);
    }
  }, [customerUser]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-success';
      case 'Shipped':
        return 'badge-sale';
      case 'Processing':
      case 'Confirmed':
        return 'badge-warning';
      case 'Cancelled':
        return 'badge-danger';
      default:
        return 'badge-sand';
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '80vh', padding: '40px 0 90px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <Link to="/account" style={{ textDecoration: 'underline' }}>My Account</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Order History</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '0.04em', margin: 0 }}>My Boutique Orders</h1>
            <p style={{ fontSize: '14px', margin: '4px 0 0' }}>
              Track real-time dispatch, live BlueDart AWB transit, and review delivered heirloom garments
            </p>
          </div>

          <Link to="/shop" className="btn btn-sand btn-sm">
            Discover New Creations
          </Link>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '60px 20px',
              textAlign: 'center',
            }}
          >
            <Package size={40} color="var(--accent-gold)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '8px' }}>No orders found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              You haven't placed any boutique orders yet.
            </p>
            <Link to="/shop" className="btn btn-primary btn-sm">
              Explore Atelier
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="admin-card-hover"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    padding: '16px 24px',
                    backgroundColor: 'var(--surface-alt)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-light)', display: 'block' }}>
                        ORDER NUMBER
                      </span>
                      <strong style={{ fontSize: '15px', color: 'var(--primary)' }}>
                        {order.orderNumber}
                      </strong>
                    </div>

                    <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-light)', display: 'block' }}>
                        DATE PLACED
                      </span>
                      <span style={{ fontSize: '13px' }}>
                        {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-light)', display: 'block' }}>
                        TOTAL AMOUNT
                      </span>
                      <strong style={{ fontSize: '14px' }}>
                        ₹{order.pricing.total.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <Link
                      to={`/account/orders/${order.orderNumber}`}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      VIEW DETAILS & TRACK <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '54px', height: '68px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--text-espresso)' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking teaser if shipped */}
                {order.shippingInfo && (
                  <div
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'var(--surface-sand)',
                      borderTop: '1px solid var(--border)',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span>
                      Courier: <strong>{order.shippingInfo.courierName}</strong> | Waybill AWB:{' '}
                      <strong style={{ color: 'var(--primary)' }}>{order.shippingInfo.trackingNumber}</strong>
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Expected: {order.shippingInfo.expectedDelivery}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
