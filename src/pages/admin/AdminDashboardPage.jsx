import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  Clock,
  Users,
  ArrowRight,
  TrendingUp,
  Plus,
  Boxes,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { customerService } from '../../services/customerService';

const WEEKLY_SALES_DATA = [
  { day: 'Mon', height: 42, revenue: '₹1,24,000', orders: 18, isToday: false },
  { day: 'Tue', height: 48, revenue: '₹1,38,500', orders: 21, isToday: false },
  { day: 'Wed', height: 60, revenue: '₹1,56,000', orders: 25, isToday: false },
  { day: 'Thu', height: 75, revenue: '₹1,82,400', orders: 32, isToday: true },
  { day: 'Fri', height: 38, revenue: '₹1,12,000', orders: 15, isToday: false },
  { day: 'Sat', height: 88, revenue: '₹2,10,000', orders: 39, isToday: false },
  { day: 'Sun', height: 70, revenue: '₹1,74,200', orders: 28, isToday: false },
];

const CATEGORY_DISTRIBUTION = [
  {
    name: 'Pure Silk Sarees (Banarasi & Kanjivaram)',
    amount: '₹4,82,400',
    percent: 46,
    color: '#58111A', // Deep Imperial Burgundy
  },
  {
    name: 'Bridal Velvet & Silk Lehengas',
    amount: '₹2,93,600',
    percent: 28,
    color: '#C5A059', // Brushed Champagne Gold
  },
  {
    name: 'Festive & Hand-Embroidered Kurtis',
    amount: '₹1,67,800',
    percent: 16,
    color: '#8C6D23', // Antique Bronze Gold
  },
  {
    name: 'Heritage Kundan & Polki Jewellery',
    amount: '₹1,04,900',
    percent: 10,
    color: '#1C1917', // Obsidian Noir
  },
];

export const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    setOrders(orderService.getAllOrders());
    setProducts(productService.getAllProducts());
    setCustomers(customerService.getAllCustomers());
  }, []);

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  const pendingOrders = orders.filter((o) => ['Placed', 'Confirmed', 'Processing'].includes(o.status));
  const lowStockProducts = products.filter((p) => p.stock <= 3);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Shipped': return 'badge-sale';
      case 'Processing':
      case 'Confirmed': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-sand';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600 }}>
            ATELIER STORE PERFORMANCE
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', letterSpacing: '0.04em', margin: '4px 0 6px' }}>Operations Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Real-time sales, order fulfillment, stock alerts, and client concierge metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={15} /> ADD NEW PRODUCT
          </Link>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            VIEW ALL ORDERS
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
        }}
        className="kpi-grid"
      >
        {/* Card 1: Today's Orders */}
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '22px 20px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.14em' }}>Today's Orders</span>
            <div className="admin-card-icon" style={{ padding: '7px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--primary)' }}>
              <ShoppingBag size={15} strokeWidth={1.3} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--text-espresso)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            24
          </div>
          <span style={{ fontSize: '11px', color: 'var(--success)', marginTop: '6px', display: 'block', letterSpacing: '0.02em' }}>
            &uarr; 18% vs yesterday
          </span>
        </div>

        {/* Card 2: Today's Revenue */}
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '22px 20px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.14em' }}>Total Revenue</span>
            <div className="admin-card-icon" style={{ padding: '7px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--primary)' }}>
              <TrendingUp size={15} strokeWidth={1.3} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-espresso)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '6px', display: 'block', letterSpacing: '0.02em', fontWeight: 500 }}>
            Luxury Atelier AOV
          </span>
        </div>

        {/* Card 3: Total Products */}
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '22px 20px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.14em' }}>Catalog Pieces</span>
            <div className="admin-card-icon" style={{ padding: '7px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--accent-gold)' }}>
              <Package size={15} strokeWidth={1.3} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--text-espresso)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            {products.length}
          </div>
          <Link to="/admin/products" style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '6px', display: 'block', textDecoration: 'underline', letterSpacing: '0.04em' }}>
            Manage catalog &rarr;
          </Link>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '22px 20px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.14em' }}>Low Stock</span>
            <div className="admin-card-icon" style={{ padding: '7px', backgroundColor: 'var(--warning-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--warning)' }}>
              <AlertTriangle size={15} strokeWidth={1.3} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--warning)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            {lowStockProducts.length}
          </div>
          <Link to="/admin/inventory" style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '6px', display: 'block', textDecoration: 'underline', letterSpacing: '0.04em' }}>
            Reorder stock &rarr;
          </Link>
        </div>

        {/* Card 5: Pending Orders */}
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '22px 20px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.14em' }}>Pending Queue</span>
            <div className="admin-card-icon" style={{ padding: '7px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-espresso)' }}>
              <Clock size={15} strokeWidth={1.3} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--text-espresso)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            {pendingOrders.length}
          </div>
          <Link to="/admin/orders" style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '6px', display: 'block', textDecoration: 'underline', letterSpacing: '0.04em' }}>
            Dispatch queue &rarr;
          </Link>
        </div>

        {/* Card 6: Registered Patrons */}
        <div className="admin-card-hover" style={{ backgroundColor: '#FFFFFF', padding: '22px 20px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.14em' }}>Atelier Patrons</span>
            <div className="admin-card-icon" style={{ padding: '7px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--primary)' }}>
              <Users size={15} strokeWidth={1.3} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--text-espresso)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            1,248
          </div>
          <Link to="/admin/customers" style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '6px', display: 'block', textDecoration: 'underline', letterSpacing: '0.04em' }}>
            Patron directory &rarr;
          </Link>
        </div>
      </div>

      {/* 2-Column Split: Operations (Left) + Sales Overview Widget (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '28px', alignItems: 'start' }} className="dashboard-split">
        {/* Left Column: Recent Orders + Stock Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Orders Table Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>Recent Orders</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Latest orders received from storefront customers
                </p>
              </div>
              <Link to="/admin/orders" className="btn btn-sand btn-sm">
                View All Orders ({orders.length}) <ArrowRight size={13} />
              </Link>
            </div>

            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 14px' }}>Order ID</th>
                    <th style={{ padding: '10px 14px' }}>Customer</th>
                    <th style={{ padding: '10px 14px' }}>Items</th>
                    <th style={{ padding: '10px 14px' }}>Total</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--primary)' }}>
                        {ord.orderNumber}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <strong>{ord.customer.name}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {ord.shippingAddress.city}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>{ord.items.length} item{ord.items.length !== 1 ? 's' : ''}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                        ₹{ord.pricing.total.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${getStatusBadgeClass(ord.status)}`}>
                          <span className="badge-dot" />
                          {ord.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <Link to={`/admin/orders/${ord.orderNumber}`} className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: '11px', letterSpacing: '0.08em' }}>
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Alerts Watchlist Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '24px',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-espresso)' }}>Stock Alerts Watchlist</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Heirloom pieces requiring urgent atelier replenishment
                </p>
              </div>
              <Link to="/admin/inventory" className="btn btn-sand btn-sm">
                <Boxes size={14} /> Manage Inventory
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} className="stock-alerts-grid">
              {lowStockProducts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="admin-card-hover"
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '13px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      SKU: {item.sku} • ₹{(item.salePrice || item.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: item.stock === 0 ? 'var(--danger-bg)' : 'var(--warning-bg)',
                      color: item.stock === 0 ? 'var(--danger)' : 'var(--warning)',
                      borderColor: item.stock === 0 ? 'rgba(153, 27, 27, 0.25)' : 'rgba(180, 105, 14, 0.25)',
                      fontSize: '10.5px',
                    }}
                  >
                    <span className="badge-dot" />
                    {item.stock === 0 ? 'OUT' : `${item.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Custom Sales Overview Widget */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '28px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            position: 'sticky',
            top: '24px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, margin: '0 0 4px', color: 'var(--text-espresso)' }}>
                Sales Overview
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Weekly revenue trend & category distribution
              </p>
            </div>
            <span
              style={{
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '11px',
                color: 'var(--accent-gold)',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              March 2026
            </span>
          </div>

          {/* Weekly Revenue Trend Bar Chart in Single Brand Metallic Tone */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: '110px',
                padding: '0 8px 4px',
              }}
            >
              {WEEKLY_SALES_DATA.map((item) => (
                <div
                  key={item.day}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  title={`${item.day}: ${item.revenue} (${item.orders} orders)`}
                >
                  {/* Bar */}
                  <div
                    style={{
                      width: '28px',
                      height: `${item.height}%`,
                      backgroundColor: item.isToday ? 'var(--accent-gold)' : 'rgba(197, 160, 89, 0.22)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      if (!item.isToday) e.currentTarget.style.backgroundColor = 'rgba(197, 160, 89, 0.65)';
                    }}
                    onMouseLeave={(e) => {
                      if (!item.isToday) e.currentTarget.style.backgroundColor = 'rgba(197, 160, 89, 0.22)';
                    }}
                  />
                  {/* Day Label */}
                  <span
                    style={{
                      fontSize: '11px',
                      color: item.isToday ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: item.isToday ? 700 : 500,
                      marginTop: '8px',
                      borderBottom: item.isToday ? '2px solid var(--accent-gold)' : 'none',
                      paddingBottom: item.isToday ? '1px' : '0',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: 'var(--text-espresso)', fontWeight: 500 }}>
                      {cat.name}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-espresso)' }}>
                    {cat.amount} <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '12px' }}>({cat.percent}%)</span>
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: '#F3EFEA',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${cat.percent}%`,
                      height: '100%',
                      backgroundColor: cat.color,
                      borderRadius: '3px',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hairline Divider */}
          <div style={{ borderTop: '1px dashed var(--border)', margin: '24px 0 18px' }} />

          {/* Bottom 3-Column Metrics (Matching Image 2) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-espresso)', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
                ₹10,48,700
              </div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                MONTH-TO-DATE
              </div>
            </div>

            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-espresso)', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
                ₹12,480
              </div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                AVG ORDER VALUE
              </div>
            </div>

            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-espresso)', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
                98.4%
              </div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                ON-TIME DISPATCH
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1280px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .dashboard-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stock-alerts-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};
