import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, ShieldCheck, Edit3, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { useWishlist } from '../../context/WishlistContext';

export const AccountPage = () => {
  const { customerUser, updateCustomerProfile } = useAuth();
  const { wishlistCount } = useWishlist();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');

  const recentOrders = orderService.getCustomerOrders(customerUser.email) || [];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomerProfile({ name, phone, email });
    setIsEditingProfile(false);
    showToast('Customer profile updated', 'success');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '85vh', padding: '40px 0 90px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Customer Account</span>
        </div>

        {/* Profile Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '32px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-sand)',
                border: '2px solid var(--accent-sand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              {customerUser.name.charAt(0)}
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
                ATELIER PATRON
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '2px 0 4px' }}>{customerUser.name}</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {customerUser.email} • {customerUser.phone}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/account/orders" className="btn btn-primary btn-sm">
              <Package size={14} /> VIEW ALL MY ORDERS
            </Link>
            <Link to="/admin" className="btn btn-dark btn-sm">
              SWITCH TO ADMIN (/admin)
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px',
          }}
          className="account-stats-grid"
        >
          <Link
            to="/account/orders"
            className="admin-card-hover customer-stat-card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <span
              className="customer-stat-val"
              style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}
            >
              {recentOrders.length}
            </span>
            <span style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>
              Total Orders Placed
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="admin-card-hover customer-stat-card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <span
              className="customer-stat-val"
              style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}
            >
              {wishlistCount}
            </span>
            <span style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>
              Items in Wishlist
            </span>
          </Link>

          <div
            className="admin-card-hover customer-stat-card"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <span
              className="customer-stat-val"
              style={{ fontSize: '28px', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-serif)' }}
            >
              VIP
            </span>
            <span style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>
              Complimentary Shipping Status
            </span>
          </div>
        </div>

        {/* Content Tabs */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '12px',
              marginBottom: '28px',
            }}
          >
            {[
              { id: 'overview', label: 'Recent Orders Preview' },
              { id: 'addresses', label: 'Saved Shipping Addresses' },
              { id: 'profile', label: 'Profile Information' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                  paddingBottom: '10px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', margin: 0 }}>Recent Atelier Orders</h3>
                <Link to="/account/orders" style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  View All Orders →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No orders placed yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {recentOrders.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      className="admin-card-hover"
                      style={{
                        padding: '16px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xs)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '15px', color: 'var(--primary)' }}>{o.orderNumber}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                          {new Date(o.orderDate).toLocaleDateString('en-GB')}
                        </span>
                        <div style={{ fontSize: '13px', marginTop: '4px' }}>
                          {o.items.length} item{o.items.length !== 1 ? 's' : ''} • Total: ₹{o.pricing.total.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-sand">{o.status}</span>
                        <Link to={`/account/orders/${o.orderNumber}`} className="btn btn-outline btn-sm">
                          Details & Track
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Saved Delivery Addresses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="addresses-grid">
                {customerUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="admin-card-hover"
                    style={{
                      padding: '20px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: '#FFFFFF',
                      position: 'relative',
                    }}
                  >
                    <span className="badge badge-sand" style={{ marginBottom: '8px' }}>
                      DEFAULT SHIPPING ADDRESS
                    </span>
                    <h4 style={{ fontSize: '15px', margin: '4px 0' }}>{addr.name}</h4>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {addr.addressLine}
                    </p>
                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                      Contact: {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ maxWidth: '540px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Profile Details</h3>
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">FULL NAME</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PHONE NUMBER</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  SAVE PROFILE UPDATES
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .account-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .addresses-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
