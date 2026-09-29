import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, ShoppingBag, Star, Package } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { orderService } from '../../services/orderService';
import { reviewService } from '../../services/reviewService';

export const AdminCustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const c = customerService.getCustomerById(id);
    setCustomer(c);
    if (c) {
      setOrders(orderService.getCustomerOrders(c.email) || []);
      const allRev = reviewService.getAllReviews();
      setReviews(allRev.filter((r) => r.customerName === c.name));
    }
  }, [id]);

  if (!customer) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Customer Not Found</h2>
        <Link to="/admin/customers" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/admin/customers" className="btn btn-sand btn-sm">
            <ArrowLeft size={15} /> All Customers
          </Link>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: 0 }}>{customer.name}</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Patron ID: {customer.id} • Registered since {new Date(customer.joinedDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
        className="cust-stats-grid"
      >
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
            TOTAL SPENT
          </span>
          <strong style={{ fontSize: '22px', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
            ₹{customer.totalSpent.toLocaleString('en-IN')}
          </strong>
        </div>

        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
            ORDERS PLACED
          </span>
          <strong style={{ fontSize: '22px', fontFamily: 'var(--font-serif)' }}>
            {customer.ordersCount} Orders
          </strong>
        </div>

        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
            PRIMARY CITY
          </span>
          <strong style={{ fontSize: '18px' }}>
            {customer.city}
          </strong>
        </div>

        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
            STATUS
          </span>
          <span className="badge badge-success" style={{ marginTop: '4px' }}>
            Active Patron
          </span>
        </div>
      </div>

      {/* Orders History Card */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          Order History ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No orders found for this patron in current session.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-alt)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--primary)' }}>{ord.orderNumber}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                    {new Date(ord.orderDate).toLocaleDateString('en-GB')}
                  </span>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {ord.items.map((i) => i.name).join(', ')}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <strong style={{ fontSize: '14px' }}>₹{ord.pricing.total.toLocaleString('en-IN')}</strong>
                  <span className="badge badge-sand">{ord.status}</span>
                  <Link to={`/admin/orders/${ord.orderNumber}`} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }}>
                    Manage Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cust-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
